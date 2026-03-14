## Endpoints (auth-service scope)

🔒 = требует `Authorization: Bearer <token>`.

| Method | Path | Auth | Request body | Response |
|--------|------|------|-------------|----------|
| POST | `/auth/register` | — | `{ user_name, email, password }` | 201: `{ token, user }` |
| POST | `/auth/login` | — | `{ email, password }` | 200: `{ token, user }` |
| GET | `/auth/me` | 🔒 | — | 200: user + profile fields |
| POST | `/auth/logout` | 🔒 | — | 204: No Content |

**`GET /auth/me` response** (тип `MeResponse` из shared-types):
```json
{
  "user_id": 1,
  "user_name": "string",
  "email": "string",
  "user_profile_id": null,
  "user_description": "",
  "photo_path": null,
  "social_links": []
}
```
> `user_profile` живёт в main-service — возвращать null/пустые defaults.

**Error body:**
```json
{ "error": { "code": "string", "message": "string" } }
```

Конфликт при регистрации (email занят) → 409. Неверный пароль → 401.
