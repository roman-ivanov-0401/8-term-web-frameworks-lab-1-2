# Структура проекта backend-app (main-service)

```
backend-app/
├── uploads/                              # Загруженные фото пользователей (static assets)
├── src/
│   ├── main.ts                           # Точка входа: globalPrefix, Swagger, ValidationPipe, static assets
│   ├── app.module.ts                     # Корневой модуль: TypeORM, JWT, Passport, все доменные модули
│   ├── shared.ts                         # Реэкспорт типов из shared-types
│   │
│   ├── common/                           # Общие утилиты (guards, decorators)
│   │   ├── guards/
│   │   │   ├── jwt.strategy.ts           # PassportStrategy — валидация JWT, возвращает { user_id, email }
│   │   │   └── jwt-auth.guard.ts         # extends AuthGuard('jwt')
│   │   └── decorators/
│   │       └── current-user.decorator.ts # @CurrentUser() — извлекает user из request
│   │
│   ├── categories/                       # Модуль категорий напитков
│   │   ├── category.entity.ts            # Entity: categories (category_id, name, description)
│   │   ├── categories.service.ts         # findAll()
│   │   ├── categories.controller.ts      # GET /categories 🔒
│   │   └── categories.module.ts
│   │
│   ├── ingredients/                      # Модуль ингредиентов
│   │   ├── ingredient.entity.ts          # Entity: ingredients (ingredient_id, name, description, color)
│   │   ├── ingredients.service.ts        # findAll(search?)
│   │   ├── ingredients.controller.ts     # GET /ingredients?search= 🔒
│   │   └── ingredients.module.ts
│   │
│   ├── drinks/                           # Модуль напитков
│   │   ├── drink.entity.ts               # Entity: drinks (ManyToOne → category)
│   │   ├── drink-ingredient.entity.ts    # Entity: drinks_ingredients (composite PK, поле percent)
│   │   ├── dto/
│   │   │   └── get-drinks.dto.ts         # Query DTO: page, per_page, category_ids[], ingredients[], search
│   │   ├── drinks.service.ts             # getList(dto, userId?) — пагинация, фильтры, isInFavorites/score
│   │   │                                 # getById(drinkId, userId?) — детали с ingredients и user_rating
│   │   ├── drinks.controller.ts          # GET /drinks, GET /drinks/:id 🔒
│   │   └── drinks.module.ts
│   │
│   ├── users/                            # Модуль профилей пользователей
│   │   ├── user-profile.entity.ts        # Entity: user_profile (user_id — plain bigint, без FK)
│   │   ├── social-link.entity.ts         # Entity: social_links (ManyToOne → user_profile)
│   │   ├── dto/
│   │   │   ├── update-profile.dto.ts     # user_name?, user_description?
│   │   │   └── create-social-link.dto.ts # link
│   │   ├── users.service.ts              # getProfile, updateProfile (с фото), deleteProfile, social links CRUD
│   │   ├── users.controller.ts           # GET /users/:id, PUT/DELETE /users/me 🔒, social-links 🔒
│   │   └── users.module.ts
│   │
│   ├── favorites/                        # Модуль избранного
│   │   ├── favorite.entity.ts            # Entity: favorites_user_drinks (composite PK: user_id + drink_id)
│   │   ├── dto/
│   │   │   ├── toggle-favorite.dto.ts    # drink_id
│   │   │   └── update-rating.dto.ts      # rating (1–5)
│   │   ├── favorites.service.ts          # getFavorites, toggle, updateRating, remove
│   │   ├── favorites.controller.ts       # /users/:user_id/favorites/* 🔒
│   │   └── favorites.module.ts
│   │
│   └── matches/                          # Модуль матчей
│       ├── matches.service.ts            # Алгоритм match_score: пересечение избранных / max(my, their)
│       ├── matches.controller.ts         # GET /matches 🔒
│       └── matches.module.ts
│
├── package.json
├── tsconfig.json                         # paths: @shared/* → ../shared-types/src/*
└── structure.md                          # ← этот файл
```

