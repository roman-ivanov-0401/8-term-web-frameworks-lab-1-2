# Структура auth-service

```
auth-service/
├── src/
│   ├── main.ts                        # Точка входа: bootstrap, ValidationPipe, CORS, Swagger (/auth/docs)
│   ├── app.module.ts                  # Корневой модуль: TypeORM, JwtModule (global), AuthModule, UsersModule
│   ├── shared.ts                      # Ре-экспорт типов из ../shared-types
│   │
│   ├── users/
│   │   ├── user.entity.ts             # TypeORM entity таблицы users (user_id, user_name, email, password_hash, created_at, modified_at)
│   │   ├── users.service.ts           # CRUD-методы: findByEmail(), findById(), create()
│   │   └── users.module.ts            # Регистрирует User entity, экспортирует UsersService
│   │
│   └── auth/
│       ├── auth.module.ts             # Импортирует UsersModule, PassportModule; провайдеры: AuthService, JwtStrategy
│       ├── auth.controller.ts         # POST /auth/register, /auth/login, /auth/logout; GET /auth/me
│       ├── auth.service.ts            # Бизнес-логика: register (bcrypt + JWT), login (bcrypt + JWT)
│       ├── jwt.strategy.ts            # Passport JWT strategy: извлекает токен из Bearer, validate → { user_id, email }
│       ├── jwt-auth.guard.ts          # AuthGuard('jwt') — защита маршрутов
│       └── dto/
│           ├── register.dto.ts        # user_name, email, password — @IsEmail, @MinLength(6), @ApiProperty
│           └── login.dto.ts           # email, password — @IsEmail, @IsString, @ApiProperty
│
├── package.json
├── tsconfig.json
└── CLAUDE.md
```
