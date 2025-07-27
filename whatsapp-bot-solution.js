// Решение проблемы с геолокацией для WhatsApp бота
const { Client, LocalAuth } = require('whatsapp-web.js');
const HttpsProxyAgent = require('https-proxy-agent');

// Вариант 1: Использование прокси
const proxyConfig = {
    host: 'proxy-server.com', // Прокси из разрешенного региона
    port: 8080,
    auth: {
        username: 'username',
        password: 'password'
    }
};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            // Добавляем прокси
            `--proxy-server=${proxyConfig.host}:${proxyConfig.port}`
        ],
        headless: true
    }
});

// Вариант 2: Использование облачного хостинга
// Развертывание на Heroku/DigitalOcean/AWS в регионах:
// - Европа (eu-west-1, eu-central-1)
// - США (us-east-1, us-west-2)
// - Азия (ap-southeast-1, ap-northeast-1)

// Вариант 3: Альтернативные библиотеки
const { WhatsAppAPI } = require('whatsapp-api-js');
// или
const { create } = require('@open-wa/wa-automate');

// Вариант 4: Использование официального API WhatsApp Business
const axios = require('axios');

const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        const response = await axios.post('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'text',
            text: { body: message }
        }, {
            headers: {
                'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        throw error;
    }
};

// Вариант 5: Использование Webhook вместо прямого подключения
const express = require('express');
const app = express();

app.post('/webhook', (req, res) => {
    const { body } = req;
    
    if (body.object === 'whatsapp_business_account') {
        // Обработка входящих сообщений
        console.log('Получено сообщение:', body);
    }
    
    res.status(200).send('OK');
});

// Рекомендации для решения проблемы:

// 1. Используйте прокси из разрешенных регионов:
// - Европа (Германия, Нидерланды, Франция)
// - США (Калифорния, Нью-Йорк)
// - Азия (Сингапур, Япония)

// 2. Настройте User-Agent и другие заголовки:
const customHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br'
};

// 3. Используйте ротацию IP-адресов
const proxyList = [
    'proxy1.com:8080',
    'proxy2.com:8080',
    'proxy3.com:8080'
];

// 4. Добавьте задержки между запросами
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 5. Используйте официальный WhatsApp Business API
// Это самое надежное решение, но требует верификации бизнеса

client.on('qr', (qr) => {
    console.log('QR код для подключения:', qr);
    // QR код должен сканироваться с устройства из того же региона
    // что и прокси-сервер
});

client.on('ready', () => {
    console.log('Клиент готов!');
});

client.initialize();