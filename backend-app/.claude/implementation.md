## Implementation Details

### JWT Guard (локальная валидация, без вызова auth-service)

```ts
// common/guards/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';
export class JwtAuthGuard extends AuthGuard('jwt') {}

// В AppModule зарегистрировать JwtModule БЕЗ signOptions (только верификация):
JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET ?? 'dev-secret',
})
```

Нужна JWT Strategy — аналогично auth-service, `validate` возвращает `{ user_id, email }`.

```ts
// common/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
// Использование: getProfile(@CurrentUser() user: { user_id: number, email: string })
```

### Shared types

```ts
import { DrinkListItem, Match, JwtPayload } from '@shared/index';
```

Алиас `@shared/*` → `../shared-types/src/*` задан в `tsconfig.json`. Использовать типы из shared-types для форм ответов и DTO-интерфейсов. Классы DTO создавать с `class-validator` декораторами, реализующими эти интерфейсы.

### File upload (PUT /users/me)

```ts
@UseInterceptors(FileInterceptor('photo', { dest: './uploads' }))
async updateProfile(@UploadedFile() file: Express.Multer.File, ...) {}
```

`photo_path` в БД хранит `/uploads/<filename>`. Отдавать файлы через `app.useStaticAssets('uploads', { prefix: '/uploads' })` в `main.ts`.

### Matches algorithm

```
1. Получить избранные напитки текущего пользователя (с рейтингами)
2. Найти всех других пользователей, у которых есть хотя бы 1 общий напиток
3. Для каждого:
   common_drinks = пересечение drink_id
   match_score = common_drinks.length / Math.max(my_count, their_count)
4. Сортировать по match_score DESC
```

### Swagger

Все DTO — `@ApiProperty()`. Защищённые маршруты — `@ApiBearerAuth()`.
Swagger уже инициализирован в `main.ts`, не удалять.

### Границы ответственности

- НЕ создавать entity/таблицу `users` — она в auth-service
- НЕ реализовывать `/auth/*` маршруты
- НЕ делать HTTP-вызовы в auth-service
- НЕ менять `../shared-types/` — только читать
- НЕ менять `docker-compose.yml`, `nginx/`, файлы вне `backend-app/`
