## Architecture

NestJS, port **3051**. Swagger на `/auth/docs`. Нет глобального префикса — контроллеры сами задают `/auth`.

```
src/
  app.module.ts          # TypeORM + JwtModule (уже настроены)
  main.ts                # bootstrap (уже готов)
  auth/
    auth.module.ts
    auth.controller.ts   # POST /auth/register, /auth/login, /auth/logout; GET /auth/me
    auth.service.ts      # register, login, validateUser
    jwt.strategy.ts      # PassportJS JWT strategy
    jwt-auth.guard.ts    # extends AuthGuard('jwt')
    dto/
      register.dto.ts    # user_name, email, password — с @IsEmail, @MinLength
      login.dto.ts       # email, password
  users/
    users.module.ts
    users.service.ts     # findByEmail, findById, create
    user.entity.ts       # TypeORM entity таблицы users
```

**Code style:** single quotes, trailing commas (Prettier). `module: commonjs`, target ES2020.
Dependency injection через конструктор. `@Module` / `@Controller` / `@Injectable`.
