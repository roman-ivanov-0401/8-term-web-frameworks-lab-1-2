# CLAUDE.md — auth-service

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this service does

**Auth service** сервиса для матчинга людей по вкусам в кофе.
Отвечает за: регистрацию, вход, JWT-токены, базовую информацию об аккаунте.
Порт **3051**, Swagger на `/auth/docs`.

Весь остальной функционал (напитки, профили, матчи) — в соседнем сервисе `../backend-app`.

## Commands

```bash
npm install          # установить зависимости
npm run start:dev    # watch mode (порт 3051)
npm run build        # компиляция в dist/
npm run start:prod   # запуск dist/main.js
npm run test         # jest
npm run lint         # eslint --fix
```

Запуск одного теста: `npx jest src/auth/auth.service.spec.ts`

Env переменные из `.env` в этой директории — скопировать из `../.env.example`.

@.claude/architecture.md
@.claude/api.md
@.claude/database.md
@.claude/implementation.md
@.claude/plan.md
