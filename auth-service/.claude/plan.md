## План реализации

`main.ts` и `app.module.ts` уже готовы — не трогать.
После каждого шага запускай `npx tsc --noEmit` и убеждайся, что ошибок нет.

### Шаг 1 — UsersModule
```
src/users/user.entity.ts       # TypeORM entity таблицы users
src/users/users.service.ts     # findByEmail(email), findById(id), create(dto)
src/users/users.module.ts      # экспортировать UsersService
```

### Шаг 2 — AuthModule: основа
```
src/auth/dto/register.dto.ts   # class с @IsEmail, @IsString, @MinLength, @ApiProperty
src/auth/dto/login.dto.ts      # email + password
src/auth/jwt.strategy.ts       # PassportStrategy — validate возвращает { user_id, email }
src/auth/jwt-auth.guard.ts     # extends AuthGuard('jwt')
```

### Шаг 3 — AuthModule: логика и контроллер
```
src/auth/auth.service.ts       # register, login — bcrypt + JwtService.sign
src/auth/auth.controller.ts    # POST /auth/register, /login, /logout; GET /auth/me
src/auth/auth.module.ts        # imports: UsersModule, PassportModule; providers: JwtStrategy
```

### Шаг 4 — Подключить в AppModule
Добавить `AuthModule` и `UsersModule` в импорты `app.module.ts`.

### Шаг 5 — Финальная проверка
```bash
npx tsc --noEmit          # нет ошибок компиляции
npm run start:dev         # сервер стартует на порту 3051
# Открыть http://localhost:3051/auth/docs — все 4 эндпоинта видны
```
