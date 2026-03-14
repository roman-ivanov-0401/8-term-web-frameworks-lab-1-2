## Implementation Details

### Пароли

`bcrypt` с `saltRounds = 10`:
```ts
const hash = await bcrypt.hash(password, 10);
await bcrypt.compare(password, hash);
```

### JWT

Подписывать токен с payload `{ sub: user_id, email }` (тип `JwtPayload` из shared-types).
`JwtModule` уже зарегистрирован глобально в `app.module.ts`.

```ts
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'dev-secret',
    });
  }
  async validate(payload: JwtPayload) {
    return { user_id: payload.sub, email: payload.email };
  }
}
```

`JwtStrategy` регистрировать как provider в `AuthModule`. `PassportModule` добавить в imports.

### Shared types

```ts
import { JwtPayload, AuthResponse, RegisterDto, MeResponse } from '@shared/index';
```

Алиас `@shared/*` → `../shared-types/src/*` задан в `tsconfig.json`.
Для NestJS DTO — создавать классы с `class-validator` декораторами, реализующие типы из shared-types.

### Logout

JWT stateless — просто вернуть 204. Blacklist токенов не нужен для лабы.

### Swagger

Все DTO — `@ApiProperty()`. Защищённые маршруты — `@ApiBearerAuth()`.
Swagger уже инициализирован в `main.ts` (`/auth/docs`), не удалять.

### Границы ответственности

- НЕ создавать entity/таблицы кроме `users`
- НЕ реализовывать маршруты `/api/v1/*`
- НЕ делать HTTP-вызовы в main-service (backend-app)
- НЕ менять `../shared-types/` — только читать
- НЕ менять `docker-compose.yml`, `nginx/`, файлы вне `auth-service/`
