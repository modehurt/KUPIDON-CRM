"""
Простая диагностика проблемы с WhatsApp без внешних зависимостей
"""

import urllib.request
import json
import socket

def check_current_ip():
    """Проверка текущего IP и геолокации"""
    print("🔍 Проверяем текущий IP...")
    try:
        response = urllib.request.urlopen('https://ipapi.co/json/')
        data = json.loads(response.read().decode())
        
        print(f"\n📍 Ваше текущее местоположение:")
        print(f"   IP: {data.get('ip')}")
        print(f"   Страна: {data.get('country_name')} ({data.get('country')})")
        print(f"   Город: {data.get('city')}")
        print(f"   Провайдер: {data.get('org')}")
        
        if data.get('country') == 'RU':
            print("\n   ⚠️  ВНИМАНИЕ: Обнаружен российский IP!")
            print("   WhatsApp может блокировать подключения из России.")
            return False
        return True
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return None

def check_whatsapp_availability():
    """Проверка доступности WhatsApp серверов"""
    print("\n🌐 Проверяем доступность WhatsApp...")
    
    hosts = [
        ('web.whatsapp.com', 443),
        ('api.whatsapp.com', 443),
        ('www.whatsapp.com', 443)
    ]
    
    results = []
    for host, port in hosts:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            result = sock.connect_ex((host, port))
            sock.close()
            
            if result == 0:
                print(f"   ✅ {host}:{port} - доступен")
                results.append(True)
            else:
                print(f"   ❌ {host}:{port} - недоступен")
                results.append(False)
        except:
            print(f"   ❌ {host}:{port} - заблокирован")
            results.append(False)
    
    return any(results)

def print_recommendations():
    """Вывод рекомендаций"""
    print("\n💡 РЕКОМЕНДАЦИИ ДЛЯ РЕШЕНИЯ ПРОБЛЕМЫ:")
    print("\n1. БЫСТРОЕ РЕШЕНИЕ (для заказчика):")
    print("   • Использовать VPN (рекомендуется Европа или США)")
    print("   • Попробовать мобильный интернет другого оператора")
    print("   • Использовать прокси-браузер (Tor Browser)")
    
    print("\n2. ПОСТОЯННОЕ РЕШЕНИЕ (для бота):")
    print("   • Арендовать VPS в Европе ($5-10/месяц):")
    print("     - DigitalOcean (Германия, Нидерланды)")
    print("     - Hetzner (Германия)")
    print("     - Vultr (множество локаций)")
    print("   • Использовать платные прокси-сервисы")
    print("   • Настроить SSH-туннель через VPS")
    
    print("\n3. АЛЬТЕРНАТИВНЫЕ ВАРИАНТЫ:")
    print("   • WhatsApp Business API (официальный, но платный)")
    print("   • Использовать сервисы-посредники (Twilio, MessageBird)")
    print("   • Развернуть бота на зарубежном хостинге")
    
    print("\n4. ТЕХНИЧЕСКИЕ ДЕТАЛИ:")
    print("   • WhatsApp блокирует по IP-адресам")
    print("   • Блокировка может быть временной или постоянной")
    print("   • Используются также поведенческие факторы")
    print("   • Частые подключения с одного IP могут привести к бану")

def main():
    print("=" * 60)
    print("ДИАГНОСТИКА ПРОБЛЕМЫ С WHATSAPP")
    print("=" * 60)
    
    # Проверяем IP
    ip_ok = check_current_ip()
    
    # Проверяем доступность
    whatsapp_ok = check_whatsapp_availability()
    
    # Выводим итог
    print("\n" + "=" * 60)
    print("ИТОГОВЫЙ ДИАГНОЗ:")
    print("=" * 60)
    
    if ip_ok is False:
        print("\n❌ ПРОБЛЕМА ПОДТВЕРЖДЕНА!")
        print("   Ваш российский IP блокируется WhatsApp.")
        print("   Это объясняет почему у заказчика не работает QR-код.")
    elif not whatsapp_ok:
        print("\n❌ WhatsApp недоступен с текущего IP!")
        print("   Возможна блокировка на уровне провайдера или страны.")
    else:
        print("\n✅ WhatsApp доступен с текущего IP.")
        print("   Проблема может быть в других факторах.")
    
    # Рекомендации
    print_recommendations()
    
    print("\n" + "=" * 60)
    print("Для более детальной диагностики установите зависимости:")
    print("pip install -r requirements.txt")
    print("=" * 60)

if __name__ == "__main__":
    main()