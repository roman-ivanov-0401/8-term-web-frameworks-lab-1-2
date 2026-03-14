## REST API

Base URL: `/api/v1`. Protected endpoints require `Authorization: Bearer <token>`.

**Auth:** `/auth/register` (POST), `/auth/login` (POST), `/auth/me` (GET), `/auth/logout` (POST)

**Users:** `/users/:user_id` (GET), `/users/me` (PUT, DELETE), `/users/:user_id/social-links` (POST, DELETE)

**Drinks:** `/drinks` (GET, with pagination + filters: `category_ids`, `ingredients`, `search`), `/drinks/:drink_id` (GET 🔒)

**Catalog:** `/categories` (GET 🔒), `/ingredients` (GET 🔒, supports `search`)

**Favorites:** `/users/:user_id/favorites` (GET 🔒, POST 🔒), `/users/:user_id/favorites/:drink_id` (PUT 🔒 — update rating, DELETE 🔒)

**Matches:** `/matches` (GET 🔒) — возвращает пользователей с похожими вкусами и `match_score`

**Error body:**
```json
{ "error": { "code": "string", "message": "string" } }
```
