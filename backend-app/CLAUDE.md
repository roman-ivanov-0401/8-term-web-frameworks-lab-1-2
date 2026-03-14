# CLAUDE.md — backend-app (main-service)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this service does

**Main service** сервиса для матчинга людей по вкусам в кофе.
Отвечает за: каталог напитков, категории, ингредиенты, профили пользователей, избранное, матчи.
Порт **3050**, глобальный префикс `api/v1`, Swagger на `/api/v1/docs`.

Аутентификация вынесена в соседний сервис `../auth-service` — сюда не трогать.

## Commands

```bash
npm install          # установить зависимости
npm run start:dev    # watch mode (порт 3050)
npm run build        # компиляция в dist/
npm run start:prod   # запуск dist/main.js
npm run test         # jest
npm run lint         # eslint --fix
npm run format       # prettier
```

Запуск одного теста: `npx jest src/drinks/drinks.service.spec.ts`

Env переменные из `.env` в этой директории — скопировать из `../.env.example`.

@.claude/architecture.md
@.claude/api.md
@.claude/database.md
@.claude/implementation.md
@.claude/plan.md
