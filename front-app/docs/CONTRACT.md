# REST API Contract

Базовый URL: `/api/v1`

Все защищённые эндпоинты требуют заголовок `Authorization: Bearer <token>`.

---

## Общие типы

```ts
type Timestamps = {
  created_at: string; // ISO 8601
  modified_at: string; // ISO 8601
};

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  per_page: number;
};
```

---

## Аутентификация `/auth`

### Регистрация

**POST** `/auth/register`

Request body:
```json
{
  "user_name": "string",
  "email": "string",
  "password": "string"
}
```

Response `201`:
```json
{
  "token": "string",
  "user": {
    "user_id": "number",
    "user_name": "string",
    "email": "string"
  }
}
```

---

### Вход

**POST** `/auth/login`

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response `200`:
```json
{
  "token": "string",
  "user": {
    "user_id": "number",
    "user_name": "string",
    "email": "string"
  }
}
```

---

### Текущий пользователь

**GET** `/auth/me`

Response `200`:
```json
{
  "user_id": "number",
  "user_name": "string",
  "email": "string",
  
  "user_profile_id": "number",
  "user_description": "string",
  "photo_path": "string | null",
  "social_links": [
    {
      "social_link_id": "number",
      "link": "string",
    }
  ],
} ```

---

### Выход

**POST** `/auth/logout`

Response `204`: No Content

---

## Профиль пользователя `/users

### Получить профиль

**GET** `/users/:user_id`

Response `200`:
```json
{
  "user_profile_id": "number",
  "user_id": "number",
  "user_name": "string",
  "user_description": "string",
  "photo_path": "string | null",
  "social_links": [
    {
      "social_link_id": "number",
      "link": "string",
      "created_at": "string",
      "modified_at": "string"
    }
  ],
}
```

---

### Обновить профиль

**PUT** `/users/me`

Request body:
```json
// FormData
{
  "user_name": "string",
  "user_description": "string",
  "photo": "Blob"
}
```

Response `200`:
```json
{
  "user_profile_id": "number",
  "user_description": "string",
  "photo_path": "string | null",
}
```

### Удалить профиль
**DELETE** `/users/me`

---

### Добавить социальную ссылку

**POST** `/users/:user_id/social-links`

Request body:
```json
{
  "link": "string"
}
```

Response `201`:
```json
{
  "social_link_id": "number",
  "link": "string",
}
```

---

### Удалить социальную ссылку

**DELETE** `/users/:user_id/social-links/:social_link_id`

Response `204`: No Content

---

## Каталог напитков `/drinks`

### Получить список напитков

**GET** `/drinks`

Query params:
| Параметр       | Тип        | По умолчанию | Описание                         |
|--------------- |----------  |--------------|----------------------------------|
| `page`         | `number`   | `1`          | Номер страницы                   |
| `per_page`     | `number`   | `20`         | Количество элементов на странице |
| `category_ids` | `number[]` | —            | Фильтр по категории              |
| `ingredients`  | `number[]` | -            | Фильтр по ингредиентам           |
| `search`       | `string`   | —            | Поиск по названию                |

Response `200`:
```json
{
  "items": [
    {
      "drink_id": "number",
      "name": "string",
      "description": "string",
      "image": "string",
      "score": "number" | null,
      "isInFavorites": "boolean",
      "category": {
        "category_id": "number",
        "name": "string"
      },
    }
  ],
  "total": "number",
  "page": "number",
}
```

---

### Получить напиток

**GET** `/drinks/:drink_id` 🔒

Response `200`:
```json
{
  "drink_id": "number",
  "name": "string",
  "description": "string",
  "category": {
    "category_id": "number",
    "name": "string",
    "description": "string"
  },
  "ingredients": [
    {
      "ingredient_id": "number",
      "name": "string",
      "description": "string",
      "color": "string",
      "percent": "number"
    }
  ],
  "user_rating": "number | null",
  "created_at": "string",
  "modified_at": "string"
}
```

---

## Категории `/categories`

### Получить список категорий

**GET** `/categories` 🔒

Response `200`:
```json
[
  {
    "category_id": "number",
    "name": "string",
    "description": "string",
  }
]
```

---

## Ингредиенты `/ingredients`

### Получить список ингредиентов

**GET** `/ingredients` 🔒

| Параметр   | Тип      | По умолчанию | Описание                         |
|------------|----------|--------------|----------------------------------|
| `search`   | `string` | `""`         | Строка поиска                    |

Response `200`:
```json
[
  {
    "ingredient_id": "number",
    "name": "string",
    "description": "string",
    "color": "string"
  }
]
```

---

## Избранные напитки `/users/:user_id/favorites`

### Получить избранное пользователя

**GET** `/users/:user_id/favorites` 🔒

Query params:
| Параметр   | Тип      | По умолчанию | Описание                         |
|------------|----------|--------------|----------------------------------|
| `page`     | `number` | `1`          | Номер страницы                   |
| `per_page` | `number` | `20`         | Количество элементов на странице |

Response `200`:
```json
{
  "items": [
    {
      "drink_id": "number",
      "name": "string",
      "description": "string",
      "category": {
        "category_id": "number",
        "name": "string"
      },
      "rating": "number",
      "created_at": "string",
      "modified_at": "string"
    }
  ],
  "total": "number",
  "page": "number",
}
```

---

### Добавить (удалить) напиток в (из) избранное(-ного)

**POST** `/users/:user_id/favorites` 🔒

Request body:
```json
{
  "drink_id": "number",
}
```

Response `201`:
```json
{
  "drink_id": "number",
}
```

---


### Обновить оценку напитка

**PUT** `/users/:user_id/favorites/:drink_id` 🔒

Request body:
```json
{
  "rating": "number"
}
```

Response `200`:
```json
{
  "drink_id": "number",
  "rating": "number",
}
```

---

### Удалить напиток из избранного

**DELETE** `/users/:user_id/favorites/:drink_id` 🔒

Response `204`: No Content

---

## Метчи `/matches`

### Получить список метчей

**GET** `/matches` 🔒

Возвращает пользователей, чьи вкусы (избранные напитки и оценки) совпадают с текущим пользователем.

Response `200`:
```json
[
    {
      "user_id": "number",
      "user_name": "string",
      "photo_path": "string | null",
      "user_description": "string",
      "match_score": "number",
      "common_drinks": [
        {
          "drink_id": "number",
          "name": "string"
        }
      ]
    }
]
```

---

## Коды ошибок

| HTTP код | Описание                                              |
|----------|-------------------------------------------------------|
| `400`    | Некорректный запрос (невалидные данные)               |
| `401`    | Не авторизован (отсутствует или невалидный токен)     |
| `403`    | Доступ запрещён                                       |
| `404`    | Ресурс не найден                                      |
| `409`    | Конфликт (например, email уже зарегистрирован)        |
| `500`    | Внутренняя ошибка сервера                             |

Структура тела ошибки:
```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```
