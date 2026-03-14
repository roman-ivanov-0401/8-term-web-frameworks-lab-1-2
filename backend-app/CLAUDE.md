# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Сервис для матчинга людей по общим вкусам в кофейных напитках. Пользователи добавляют напитки в избранное и ставят оценки — на основе этого система вычисляет `match_score` с другими пользователями.

University lab project (`8-term-web-frameworks-lab-1-2`). Separate `frontend` sibling directory. `backend` branch → merges into `main`.

## Commands

```bash
# Development
npm run start:dev       # Start with watch mode
npm run build           # Compile TypeScript to dist/
npm run start:prod      # Run compiled dist/main.js

# Testing
npm run test            # Run unit tests (Jest)
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage
npm run test:e2e        # Run end-to-end tests

# Code quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
```

To run a single test file: `npx jest src/app.controller.spec.ts`

@.claude/architecture.md
@.claude/api.md
@.claude/database.md
