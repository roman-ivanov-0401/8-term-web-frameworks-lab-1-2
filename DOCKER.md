# Docker — запуск и управление

## Подготовка

```bash
cp .env.example .env
```

---

## Все сервисы

```bash
# Запустить всё (postgres + auth-service + main-service)
docker compose up -d

# Остановить (данные сохраняются)
docker compose down

# Остановить и удалить данные БД
docker compose down -v

# Пересобрать образы и запустить
docker compose up -d --build

# Посмотреть статус
docker compose ps

# Логи всех сервисов (live)
docker compose logs -f
```

---

## По отдельности

```bash
# Запустить один сервис
docker compose up -d postgres
docker compose up -d auth-service
docker compose up -d main-service

# Остановить один сервис
docker compose stop auth-service
docker compose stop main-service

# Перезапустить один сервис
docker compose restart auth-service

# Пересобрать и перезапустить один сервис
docker compose up -d --build auth-service

# Логи одного сервиса (live)
docker compose logs -f auth-service
docker compose logs -f main-service
```

---

## Адреса после запуска

| Сервис | URL |
|--------|-----|
| auth-service | http://localhost:3051 |
| auth Swagger | http://localhost:3051/auth/docs |
| main-service | http://localhost:3050 |
| main Swagger | http://localhost:3050/api/v1/docs |
| PostgreSQL | localhost:5433 |

---

## Локальная разработка (без Docker)

```bash
# Поднять только БД
docker compose up -d postgres

# Запустить сервисы локально в watch-режиме
cd auth-service && npm run start:dev
cd backend-app  && npm run start:dev
```
