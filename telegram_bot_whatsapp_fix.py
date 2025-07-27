"""
Решение проблемы с QR-кодом WhatsApp для Telegram бота
"""

import asyncio
import logging
from typing import Optional, Dict
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import base64
from io import BytesIO
from PIL import Image

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WhatsAppQRHandler:
    """
    Обработчик QR-кодов WhatsApp с обходом геоблокировок
    """
    
    def __init__(self, use_proxy: bool = True):
        self.use_proxy = use_proxy
        self.driver = None
        self.proxy_list = self._load_proxy_list()
        
    def _load_proxy_list(self) -> list:
        """
        Загрузка списка рабочих прокси
        """
        # Список бесплатных прокси для тестирования
        # В production используйте платные надежные прокси
        proxy_list = [
            {'ip': '45.76.150.192', 'port': '3128', 'country': 'US'},
            {'ip': '104.248.59.38', 'port': '80', 'country': 'UK'},
            {'ip': '167.172.180.46', 'port': '8080', 'country': 'DE'},
        ]
        
        # Проверяем работоспособность прокси
        working_proxies = []
        for proxy in proxy_list:
            if self._test_proxy(proxy):
                working_proxies.append(proxy)
                
        return working_proxies
    
    def _test_proxy(self, proxy: Dict) -> bool:
        """
        Тестирование прокси на работоспособность
        """
        proxy_url = f"http://{proxy['ip']}:{proxy['port']}"
        proxies = {
            'http': proxy_url,
            'https': proxy_url
        }
        
        try:
            response = requests.get(
                'https://api.ipify.org?format=json',
                proxies=proxies,
                timeout=5
            )
            if response.status_code == 200:
                logger.info(f"Прокси {proxy['ip']} работает")
                return True
        except Exception as e:
            logger.error(f"Прокси {proxy['ip']} не работает: {e}")
            
        return False
    
    def setup_browser(self, proxy: Optional[Dict] = None) -> bool:
        """
        Настройка браузера с учетом прокси и антидетект настроек
        """
        try:
            chrome_options = Options()
            
            # Использование прокси если указано
            if proxy and self.use_proxy:
                proxy_string = f"{proxy['ip']}:{proxy['port']}"
                chrome_options.add_argument(f'--proxy-server=http://{proxy_string}')
                logger.info(f"Используем прокси: {proxy_string} ({proxy['country']})")
            
            # Антидетект настройки
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Эмуляция реального браузера
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-gpu')
            
            # User-Agent европейского пользователя
            user_agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
            
            import random
            chrome_options.add_argument(f'user-agent={random.choice(user_agents)}')
            
            # Настройка языка и региона
            chrome_options.add_experimental_option('prefs', {
                'intl.accept_languages': 'en-US,en;q=0.9',
                'profile.default_content_setting_values.geolocation': 2  # Блокируем геолокацию
            })
            
            self.driver = webdriver.Chrome(options=chrome_options)
            
            # Внедряем JavaScript для маскировки автоматизации
            self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
                'source': '''
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5]
                    });
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['en-US', 'en']
                    });
                    window.chrome = {
                        runtime: {}
                    };
                    Object.defineProperty(navigator, 'permissions', {
                        get: () => ({
                            query: () => Promise.resolve({ state: 'denied' })
                        })
                    });
                '''
            })
            
            return True
            
        except Exception as e:
            logger.error(f"Ошибка настройки браузера: {e}")
            return False
    
    async def get_qr_code(self, max_retries: int = 3) -> Optional[str]:
        """
        Получение QR-кода с автоматическим переключением прокси при неудаче
        """
        for attempt in range(max_retries):
            proxy = None
            
            if self.use_proxy and self.proxy_list:
                # Выбираем случайный прокси из списка
                import random
                proxy = random.choice(self.proxy_list)
            
            if self.setup_browser(proxy):
                try:
                    # Переходим на WhatsApp Web
                    self.driver.get('https://web.whatsapp.com')
                    
                    # Ждем появления QR-кода
                    wait = WebDriverWait(self.driver, 30)
                    qr_element = wait.until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, 'canvas'))
                    )
                    
                    # Делаем скриншот QR-кода
                    qr_screenshot = qr_element.screenshot_as_png
                    
                    # Конвертируем в base64 для отправки в Telegram
                    qr_base64 = base64.b64encode(qr_screenshot).decode('utf-8')
                    
                    logger.info("QR-код успешно получен")
                    return qr_base64
                    
                except Exception as e:
                    logger.error(f"Попытка {attempt + 1}: Ошибка получения QR: {e}")
                    
                    if self.driver:
                        self.driver.quit()
                        self.driver = None
                    
                    # Ждем перед следующей попыткой
                    await asyncio.sleep(5)
        
        return None
    
    def cleanup(self):
        """
        Очистка ресурсов
        """
        if self.driver:
            self.driver.quit()
            self.driver = None

# Интеграция с Telegram ботом
class TelegramBotFix:
    """
    Фикс для Telegram бота с WhatsApp интеграцией
    """
    
    def __init__(self, bot_token: str):
        self.bot_token = bot_token
        self.whatsapp_handler = WhatsAppQRHandler(use_proxy=True)
    
    async def send_qr_to_user(self, chat_id: int) -> bool:
        """
        Отправка QR-кода пользователю в Telegram
        """
        try:
            # Получаем QR-код
            qr_base64 = await self.whatsapp_handler.get_qr_code()
            
            if qr_base64:
                # Конвертируем base64 в изображение
                image_data = base64.b64decode(qr_base64)
                image = Image.open(BytesIO(image_data))
                
                # Сохраняем временно
                temp_path = f'qr_{chat_id}.png'
                image.save(temp_path)
                
                # Отправляем в Telegram
                # Здесь должен быть ваш код отправки изображения через Telegram API
                
                # Удаляем временный файл
                import os
                os.remove(temp_path)
                
                return True
            else:
                # Отправляем сообщение об ошибке
                error_message = """
❌ Не удалось получить QR-код WhatsApp.

Возможные причины:
1. Блокировка по геолокации
2. Все прокси недоступны
3. WhatsApp обновил защиту

Попробуйте:
- Подождать 5-10 минут
- Использовать VPN
- Обратиться к администратору
                """
                # Отправить error_message пользователю
                
                return False
                
        except Exception as e:
            logger.error(f"Ошибка отправки QR: {e}")
            return False
        
        finally:
            self.whatsapp_handler.cleanup()

# Диагностическая функция
async def diagnose_problem():
    """
    Диагностика проблемы с подключением
    """
    print("🔍 Начинаем диагностику проблемы с WhatsApp...")
    
    # 1. Проверяем текущий IP
    try:
        response = requests.get('https://ipapi.co/json/')
        data = response.json()
        print(f"\n📍 Текущее местоположение:")
        print(f"   IP: {data.get('ip')}")
        print(f"   Страна: {data.get('country_name')} ({data.get('country')})")
        print(f"   Город: {data.get('city')}")
        print(f"   Провайдер: {data.get('org')}")
        
        if data.get('country') == 'RU':
            print("   ⚠️  Обнаружен российский IP - возможны проблемы с WhatsApp")
    except:
        print("   ❌ Не удалось определить IP")
    
    # 2. Проверяем доступность WhatsApp
    print(f"\n🌐 Проверка доступности WhatsApp:")
    urls = [
        'https://web.whatsapp.com',
        'https://api.whatsapp.com',
        'https://www.whatsapp.com'
    ]
    
    for url in urls:
        try:
            response = requests.head(url, timeout=5)
            if response.status_code < 400:
                print(f"   ✅ {url} - доступен")
            else:
                print(f"   ❌ {url} - недоступен (код {response.status_code})")
        except:
            print(f"   ❌ {url} - заблокирован или недоступен")
    
    # 3. Рекомендации
    print(f"\n💡 Рекомендации:")
    print("   1. Используйте VPN или прокси из Европы/США")
    print("   2. Арендуйте VPS в другой стране")
    print("   3. Используйте облачные сервисы (AWS, Google Cloud)")
    print("   4. Попробуйте альтернативные API (Business API)")

# Запуск диагностики
if __name__ == "__main__":
    asyncio.run(diagnose_problem())