## Endpoints (main-service scope)

Base URL: `/api/v1`. 🔒 = требует `Authorization: Bearer <token>`.

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/users/:user_id` | — | Профиль пользователя |
| PUT | `/users/me` | 🔒 | FormData: user_name, user_description, photo (Blob) |
| DELETE | `/users/me` | 🔒 | |
| POST | `/users/:user_id/social-links` | 🔒 | body: `{ link }` |
| DELETE | `/users/:user_id/social-links/:id` | 🔒 | 204 |
| GET | `/drinks` | — | Pagination + filters: `page`, `per_page`, `category_ids[]`, `ingredients[]`, `search` |
| GET | `/drinks/:drink_id` | 🔒 | Детальный напиток с ingredients |
| GET | `/categories` | 🔒 | |
| GET | `/ingredients` | 🔒 | Query: `?search=` |
| GET | `/users/:user_id/favorites` | 🔒 | Paginated |
| POST | `/users/:user_id/favorites` | 🔒 | body: `{ drink_id }` — toggle |
| PUT | `/users/:user_id/favorites/:drink_id` | 🔒 | body: `{ rating }` |
| DELETE | `/users/:user_id/favorites/:drink_id` | 🔒 | 204 |
| GET | `/matches` | 🔒 | Пользователи с похожими вкусами |

**Error body:**
```json
{ "error": { "code": "string", "message": "string" } }
```

**`GET /drinks` response** включает `isInFavorites: boolean` и `score: number | null` — нужны JOIN с `favorites_user_drinks`. Если пользователь не авторизован — `false` / `null`.
