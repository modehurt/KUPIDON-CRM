# Руководство по развертыванию WhatsApp бота

## Проблема с геолокацией

WhatsApp блокирует подключения с российских IP-адресов из-за санкций. Поэтому бот работает у вас (в РФ), но не у заказчика.

## Решения

### 1. Облачные хостинги (Рекомендуется)

#### Heroku
```bash
# Создание приложения в европейском регионе
heroku create your-bot-name --region eu

# Установка переменных окружения
heroku config:set NODE_ENV=production
heroku config:set PROXY_ENABLED=true

# Деплой
git push heroku main
```

#### DigitalOcean
```bash
# Создание дроплета в Амстердаме или Франкфурте
doctl compute droplet create whatsapp-bot \
  --size s-1vcpu-1gb \
  --image ubuntu-20-04-x64 \
  --region ams3
```

#### AWS
```bash
# Создание EC2 в европейском регионе
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro \
  --region eu-west-1 \
  --key-name your-key
```

### 2. Настройка прокси

#### Установка зависимостей
```bash
npm install https-proxy-agent puppeteer-extra puppeteer-extra-plugin-stealth
```

#### Конфигурация прокси
```javascript
const HttpsProxyAgent = require('https-proxy-agent');

const proxyConfig = {
    host: 'proxy.example.com',
    port: 8080,
    auth: {
        username: 'user',
        password: 'pass'
    }
};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--proxy-server=${proxyConfig.host}:${proxyConfig.port}`,
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ],
        headless: true
    }
});
```

### 3. Альтернативные библиотеки

#### @open-wa/wa-automate
```bash
npm install @open-wa/wa-automate
```

```javascript
const wa = require('@open-wa/wa-automate');

wa.create({
    sessionId: "TEST",
    multiDevice: true,
    headless: true,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    cacheEnabled: false,
    useChrome: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--proxy-server=proxy.example.com:8080'
    ]
}).then(client => {
    console.log('Бот готов!');
});
```

### 4. Официальный WhatsApp Business API

Это самое надежное решение:

1. Зарегистрируйтесь на [Facebook Developers](https://developers.facebook.com/)
2. Создайте приложение WhatsApp Business
3. Пройдите верификацию бизнеса
4. Получите токен доступа

```javascript
const axios = require('axios');

const sendMessage = async (phoneNumber, message) => {
    const response = await axios.post(
        'https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages',
        {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'text',
            text: { body: message }
        },
        {
            headers: {
                'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};
```

## Рекомендуемые провайдеры прокси

### Платные (Надежные)
- **Bright Data** - прокси из 72+ стран
- **Oxylabs** - резидентные прокси
- **Smartproxy** - ротационные прокси

### Бесплатные (Менее надежные)
- **FreeProxyList.net**
- **HideMyAss**
- **Proxynova**

## Настройка Docker для развертывания

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  whatsapp-bot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PROXY_HOST=proxy.example.com
      - PROXY_PORT=8080
    restart: unless-stopped
```

## Мониторинг и логирование

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

client.on('qr', (qr) => {
    logger.info('Новый QR код сгенерирован');
});

client.on('ready', () => {
    logger.info('Бот успешно подключен');
});

client.on('disconnected', (reason) => {
    logger.error('Бот отключен:', reason);
});
```

## Проверка геолокации

```javascript
const axios = require('axios');

const checkLocation = async () => {
    try {
        const response = await axios.get('https://ipapi.co/json/');
        console.log('Текущая геолокация:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка проверки геолокации:', error);
    }
};
```

## Заключение

1. **Лучшее решение**: Развертывание на зарубежном хостинге + официальный WhatsApp Business API
2. **Быстрое решение**: Использование прокси из разрешенных регионов
3. **Альтернатива**: Использование других библиотек с лучшей поддержкой прокси

Помните: QR код должен сканироваться с устройства из того же региона, что и прокси-сервер!