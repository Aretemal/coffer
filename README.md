# Coffer

Монорепозиторий: **API** (NestJS + GraphQL + Prisma) и **веб** (Next.js).

## Требования

- **Node.js** 18+ (рекомендуется LTS; на Node 24 возможны лишние предупреждения от зависимостей)
- **npm**
- **PostgreSQL** (версия, совместимая с Prisma в проекте)
- По желанию: **Redis**, **Kafka** — при недоступности часть функций логирует предупреждения, API обычно всё равно поднимается

## Структура

| Каталог | Описание |
|---------|----------|
| `api/`  | Бэкенд NestJS, GraphQL `/graphql`, порт по умолчанию **4000** |
| `web/`  | Фронтенд Next.js, порт по умолчанию **3000** |

## 1. База данных и API (`api/`)

### Переменные окружения

Создай файл `api/.env` (рядом с `package.json` в `api`). Минимально нужно:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DBNAME?schema=public"
JWT_SECRET="длинная-случайная-строка-для-prod"
```

Опционально:

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC_DOMAIN=coffer.domain
```

В **production** задай `CORS_ORIGIN` (можно несколько URL через запятую). В development CORS для `localhost` / `127.0.0.1` настроен в коде.

### Установка и миграции

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
```

После `npm install` автоматически выполняется **patch-package** (патч для `kafkajs`).

### Запуск API в режиме разработки

```bash
cd api
npm run start:dev
```

Должен появиться лог вида `Mapped {/graphql, POST}` и приложение слушает порт из `PORT` или **4000**.

Сборка:

```bash
cd api
npm run build
npm run start:prod
```

## 2. Веб-приложение (`web/`)

### Переменные окружения

Создай `web/.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Адрес должен совпадать с тем, где реально открыт фронт (например, тот же хост, что в браузере), иначе возможны проблемы с CORS.

### Установка и запуск

```bash
cd web
npm install
npm run dev
```

Открой в браузере **http://localhost:3000** (или тот порт, который выведет Next.js).

Продакшен-сборка:

```bash
cd web
npm run build
npm run start
```

## Типичный порядок запуска локально

1. Запусти PostgreSQL (и при необходимости Redis/Kafka).
2. Настрой `api/.env`, выполни миграции Prisma.
3. В одном терминале: `cd api && npm run start:dev`
4. В другом: `cd web && npm run dev`
5. Регистрация / вход на сайте, дальше работа через UI.

## Проверка API без браузера

Пример запроса к GraphQL (PowerShell):

```powershell
$body = '{"query":"mutation { __typename }"}'
Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method Post -ContentType "application/json" -Body $body
```

## Устранение неполадок

| Симптом | Что проверить |
|---------|----------------|
| Ошибки Prisma при старте | `DATABASE_URL`, доступность PostgreSQL, выполнены ли `prisma migrate` |
| Фронт не достучится до API | Запущен ли `api`, URL в `NEXT_PUBLIC_GRAPHQL_URL`, не блокирует ли DevTools запросы к `:4000` |
| CORS в production | Значение `CORS_ORIGIN` и точное совпадение с origin в браузере |

## Лицензия

См. `package.json` в `api/` и `web/`.
