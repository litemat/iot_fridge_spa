# Hangzhou Yile (Kaspi) Backend Proxy

Node.js + Express backend, который проксирует запросы из React-приложения к API Hangzhou Yile (`https://kaspi.negiz.pro`) для получения QR-кода оплаты.

## Установка

```bash
cd backend
npm install
```

## Конфигурация

1. Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

2. Заполните значения:

- `PORT` — порт backend-сервера (по умолчанию 5000)
- `APP_KEY` — секретный ключ из документации LE
- `API_BASE_URL` — базовый URL оператора (обычно `https://kaspi.negiz.pro`)
- `CALLBACK_DOMAIN` — публичный домен backend (ngrok или реальный домен)
- `MACH_ID`, `DEVICE_ID`, `COMPANY_SHH`, `PAY_COMPANY`, `CHANNEL_ID` — параметры машины

## Запуск

```bash
cd backend
npm run dev
# или
npm start
```

Сервер будет слушать `http://localhost:PORT` (по умолчанию `http://localhost:5000`).

## Эндпоинт: POST /api/get-qr

Запрос из фронтенда:

```json
POST http://localhost:5000/api/get-qr
Content-Type: application/json

{
  "items": [
    { "trackno": "10", "name": "Bottled water", "price": 5.9 }
  ]
}
```

Сервер:
- генерирует `totalorderid`, `goodsinfo[]`, `totalprice`, `timestamp`, `randstr`, `sign` (SHA1)
- отправляет запрос в формате `application/x-www-form-urlencoded` на `${API_BASE_URL}/device/le/qr`
- возвращает ответ оператора (`code`, `msg`, `orderid`, `torderid`, `twocode`).

## CORS

CORS настроен на `http://localhost:3000`, чтобы принимать запросы от React-приложения в режиме разработки.

