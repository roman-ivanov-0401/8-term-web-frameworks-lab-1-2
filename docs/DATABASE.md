# Описание сущностей базы данных

## users

Основная таблица пользователей системы.


| Поле          | Тип          | Ограничения | Описание                              |
| ------------- | ------------ | ----------- | ------------------------------------- |
| user_id       | bigint       | PK          | Уникальный идентификатор пользователя |
| user_name     | varchar(100) | nullable    | Имя пользователя                      |
| email         | varchar(100) | unique      | Электронная почта                     |
| password_hash | varchar(255) |             | Хэш пароля                            |
| created_at    | timestamptz  |             | Дата создания записи                  |
| modified_at   | timestamptz  |             | Дата последнего изменения             |


## user_profile

Профиль пользователя с дополнительной информацией.


| Поле             | Тип           | Ограничения | Описание                         |
| ---------------- | ------------- | ----------- | -------------------------------- |
| user_profile_id  | bigint        | PK          | Уникальный идентификатор профиля |
| user_description | varchar(500)  | nullable    | Описание / био пользователя      |
| photo_path       | varchar(1000) | nullable    | Путь к фотографии профиля        |
| user_id          | bigint        | FK → users  | Ссылка на пользователя           |
| created_at       | timestamptz   |             | Дата создания                    |
| modified_at      | timestamptz   |             | Дата последнего изменения        |


## social_links

Ссылки на социальные сети пользователя.


| Поле            | Тип          | Ограничения       | Описание                        |
| --------------- | ------------ | ----------------- | ------------------------------- |
| social_link_id  | bigint       | PK                | Уникальный идентификатор ссылки |
| user_profile_id | bigint       | FK → user_profile | Ссылка на профиль пользователя  |
| link            | varchar(255) |                   | URL социальной сети             |
| created_at      | timestamptz  |                   | Дата создания                   |
| modified_at     | timestamptz  |                   | Дата последнего изменения       |


## categories

Категории напитков.


| Поле        | Тип           | Ограничения | Описание                           |
| ----------- | ------------- | ----------- | ---------------------------------- |
| category_id | smallint      | PK          | Уникальный идентификатор категории |
| name        | varchar(100)  |             | Название категории                 |
| description | varchar(1000) | nullable    | Описание категории                 |
| created_at  | timestamptz   |             | Дата создания                      |
| modified_at | timestamptz   |             | Дата последнего изменения          |


## drinks

Напитки.


| Поле        | Тип           | Ограничения     | Описание                         |
| ----------- | ------------- | --------------- | -------------------------------- |
| drink_id    | bigint        | PK              | Уникальный идентификатор напитка |
| name        | varchar(100)  |                 | Название напитка                 |
| description | varchar(1000) | nullable        | Описание напитка                 |
| category_id | smallint      | FK → categories | Ссылка на категорию              |
| created_at  | timestamptz   |                 | Дата создания                    |
| modified_at | timestamptz   |                 | Дата последнего изменения        |


## ingredients

Ингредиенты для напитков.


| Поле          | Тип           | Ограничения | Описание                             |
| ------------- | ------------- | ----------- | ------------------------------------ |
| ingredient_id | int           | PK          | Уникальный идентификатор ингредиента |
| name          | varchar(100)  |             | Название ингредиента                 |
| description   | varchar(1000) | nullable    | Описание ингредиента                 |
| created_at    | timestamptz   |             | Дата создания                        |
| modified_at   | timestamptz   |             | Дата последнего изменения            |
| color         | varchar(10)   |             | Цвет ингредиента                     |


## drinks_ingredients

Связующая таблица между напитками и ингредиентами (many-to-many).


| Поле          | Тип         | Ограничения          | Описание                          |
| ------------- | ----------- | -------------------- | --------------------------------- |
| drink_id      | bigint      | PK, FK → drinks      | Ссылка на напиток                 |
| ingredient_id | int         | PK, FK → ingredients | Ссылка на ингредиент              |
| percent       | float       |                      | Процентное содержание ингредиента |
| created_at    | timestamptz |                      | Дата создания                     |
| modified_at   | timestamptz |                      | Дата последнего изменения         |


## favorites_user_drinks

Избранные напитки пользователя (many-to-many).


| Поле        | Тип         | Ограничения     | Описание                     |
| ----------- | ----------- | --------------- | ---------------------------- |
| user_id     | bigint      | PK, FK → users  | Ссылка на пользователя       |
| drink_id    | bigint      | PK, FK → drinks | Ссылка на напиток            |
| created_at  | timestamptz |                 | Дата добавления в избранное  |
| modified_at | timestamptz |                 | Дата последнего изменения    |
| rating      | smallint    | nullable        | Оценка напитка пользователем |


## Связи между таблицами

- **users** 1 → 1 **user_profile** (через user_id)
- **user_profile** 1 → N **social_links** (через user_profile_id)
- **users** N ↔ N **drinks** (через favorites_user_drinks)
- **categories** 1 → N **drinks** (через category_id)
- **drinks** N ↔ N **ingredients** (через drinks_ingredients)

