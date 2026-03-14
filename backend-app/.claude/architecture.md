## Architecture

NestJS, port **3050**, global prefix `api/v1`. One module per domain.

```
src/
  app.module.ts
  main.ts                          # globalPrefix, Swagger на /api/v1/docs, ValidationPipe
  common/
    guards/jwt-auth.guard.ts       # extends AuthGuard('jwt')
    decorators/current-user.decorator.ts  # @CurrentUser() → { user_id, email }
  users/
    users.module.ts
    users.controller.ts            # GET /users/:id, PUT/DELETE /users/me, social-links
    users.service.ts
    user-profile.entity.ts
    social-link.entity.ts
  drinks/
    drinks.module.ts
    drinks.controller.ts
    drinks.service.ts
    drink.entity.ts
    category.entity.ts
    ingredient.entity.ts
    drink-ingredient.entity.ts     # join table с полем percent
  favorites/
    favorites.module.ts
    favorites.controller.ts
    favorites.service.ts
    favorite.entity.ts
  matches/
    matches.module.ts
    matches.controller.ts
    matches.service.ts             # алгоритм match_score
```

**Code style:** single quotes, trailing commas (Prettier). `module: commonjs`, target ES2020.
Dependency injection через конструктор. `@Module` / `@Controller` / `@Injectable`.
