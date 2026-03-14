## Database — таблицы main-service

Сервис НЕ владеет таблицей `users` — она в auth-service. Ссылки на `user_id` — plain `bigint`, без FK constraint.

```
user_profile
  user_profile_id  bigint PK generated
  user_id          bigint not null  ← no FK, auth-service owns users
  user_description varchar(500) nullable
  photo_path       varchar(1000) nullable
  created_at / modified_at  timestamptz default now()

social_links
  social_link_id   bigint PK generated
  user_profile_id  bigint FK → user_profile
  link             varchar(255) not null
  created_at / modified_at

categories
  category_id   smallint PK generated
  name          varchar(100) not null
  description   varchar(1000) nullable
  created_at / modified_at

drinks
  drink_id      bigint PK generated
  name          varchar(100) not null
  description   varchar(1000) nullable
  image         varchar(1000) nullable
  category_id   smallint FK → categories
  created_at / modified_at

ingredients
  ingredient_id  int PK generated
  name           varchar(100) not null
  description    varchar(1000) nullable
  color          varchar(10) not null
  created_at / modified_at

drinks_ingredients  (join table, composite PK)
  drink_id       bigint FK → drinks
  ingredient_id  int FK → ingredients
  percent        float not null
  created_at / modified_at

favorites_user_drinks  (composite PK)
  user_id        bigint  ← no FK
  drink_id       bigint FK → drinks
  rating         smallint nullable
  created_at / modified_at
```
