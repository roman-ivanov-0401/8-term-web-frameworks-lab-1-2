## Database — таблицы auth-service

Сервис владеет **только таблицей `users`**. Все остальные таблицы принадлежат main-service (backend-app).

```
users
  user_id        bigint PK (generated: increment)
  user_name      varchar(100) nullable
  email          varchar(100) unique not null
  password_hash  varchar(255) not null
  created_at     timestamptz default now()
  modified_at    timestamptz default now()
```

TypeORM создаст таблицу автоматически через `synchronize: true` (уже настроено в `app.module.ts`).

НЕ создавать entities для `user_profile`, `social_links`, `drinks` и любых других таблиц.
