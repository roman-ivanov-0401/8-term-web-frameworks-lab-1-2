## Database Schema

Ключевые сущности и связи:

- `users` 1→1 `user_profile` 1→N `social_links`
- `categories` 1→N `drinks` N↔N `ingredients` (через `drinks_ingredients`, хранит `percent`)
- `users` N↔N `drinks` (через `favorites_user_drinks`, хранит `rating: smallint nullable`)

Поля `created_at` / `modified_at` типа `timestamptz` присутствуют во всех таблицах.
