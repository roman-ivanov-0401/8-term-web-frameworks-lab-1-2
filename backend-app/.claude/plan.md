## План реализации

`main.ts` и `app.module.ts` уже готовы — не трогать.
После каждого шага запускай `npx tsc --noEmit` и убеждайся, что ошибок нет.
Каждый новый модуль сразу добавляй в импорты `app.module.ts`.

### Шаг 1 — Common (JWT guard)
```
src/common/guards/jwt.strategy.ts            # PassportStrategy — validate: { user_id, email }
src/common/guards/jwt-auth.guard.ts          # extends AuthGuard('jwt')
src/common/decorators/current-user.decorator.ts  # @CurrentUser() из request.user
```

### Шаг 2 — CategoriesModule
```
src/categories/category.entity.ts
src/categories/categories.service.ts         # findAll()
src/categories/categories.controller.ts      # GET /categories 🔒
src/categories/categories.module.ts
```

### Шаг 3 — IngredientsModule
```
src/ingredients/ingredient.entity.ts
src/ingredients/ingredients.service.ts       # findAll(search?)
src/ingredients/ingredients.controller.ts    # GET /ingredients 🔒
src/ingredients/ingredients.module.ts
```

### Шаг 4 — DrinksModule
```
src/drinks/drink.entity.ts                   # ManyToOne → category
src/drinks/drink-ingredient.entity.ts        # join table с полем percent
src/drinks/drinks.service.ts                 # getList(query), getById(id)
src/drinks/drinks.controller.ts              # GET /drinks, GET /drinks/:id 🔒
src/drinks/drinks.module.ts
```
`GET /drinks` — пагинация + фильтры (category_ids, ingredients, search).
`isInFavorites` и `score` — LEFT JOIN с favorites_user_drinks (null если не авторизован).

### Шаг 5 — UsersModule
```
src/users/user-profile.entity.ts             # user_id — plain bigint, без FK
src/users/social-link.entity.ts              # ManyToOne → user_profile
src/users/users.service.ts
src/users/users.controller.ts                # GET /users/:id, PUT/DELETE /users/me, social-links
src/users/users.module.ts
```
`PUT /users/me` — FormData с фото через multer. Сохранять в `./uploads/`, отдавать через `useStaticAssets`.

### Шаг 6 — FavoritesModule
```
src/favorites/favorite.entity.ts             # composite PK: user_id + drink_id, поле rating
src/favorites/favorites.service.ts           # getFavorites, toggle, updateRating, remove
src/favorites/favorites.controller.ts        # все /users/:user_id/favorites/* эндпоинты 🔒
src/favorites/favorites.module.ts
```

### Шаг 7 — MatchesModule
```
src/matches/matches.service.ts               # алгоритм match_score (см. implementation.md)
src/matches/matches.controller.ts            # GET /matches 🔒
src/matches/matches.module.ts
```

### Шаг 8 — Финальная проверка
```bash
npx tsc --noEmit          # нет ошибок компиляции
npm run start:dev         # сервер стартует на порту 3050
# Открыть http://localhost:3050/api/v1/docs — все маршруты видны
```
