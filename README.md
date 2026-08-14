Backend для приложения `weather_app`, переведенный на TypeScript.

Сервер принимает запросы от фронтенда, подставляет секретный ключ `OPENWEATHERMAP_API_KEY` и запрашивает погоду у OpenWeatherMap.

## Как запустить

1. Создайте файл `.env` по образцу `.env.example`
2. Добавьте в него:

```env
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
PORT=3001
```

3. Установите зависимости и запустите сервер в dev-режиме:

```bash
npm install
npm run dev
```

По умолчанию сервер слушает `http://localhost:3001`.

Для production-сборки:

```bash
npm run build
npm start
```

## Маршруты

- `GET /api/health` — проверка, что сервер запущен
- `GET /api/weather?city=Minsk&unit=metric` — запрос погоды

## Docker Compose

```bash
docker compose up --build
```