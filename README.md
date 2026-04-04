# Bookstore RESTful API

Node.js RESTful API cho web bán sách, dùng MySQL, JWT auth, upload ảnh local.

## Cấu trúc thư mục

```
bin/          # entry point
controllers/  # xử lý logic request
routes/       # định nghĩa route
schemas/      # truy vấn database
uploads/      # ảnh upload (không commit)
utils/        # helper: db, jwt, auth, ...
validators/   # validate input
app.js
```

## Cài đặt & Chạy

1. Cài dependency:
   ```bash
   npm install
   ```

2. Tạo file `.env` từ `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Sau đó điền thông tin vào `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=bookstore_db
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Tạo database MySQL (ví dụ: `bookstore_db`) trước khi chạy.

4. Chạy server:
   ```bash
   npm start
   ```
   > Server sẽ tự tạo bảng nếu chưa tồn tại.

## Models

`user` · `category` · `book` · `cart` · `order` · `review` · `author` · `wishlist`

## Auth

| Method | Endpoint         |
|--------|-----------------|
| POST   | /auth/register  |
| POST   | /auth/login     |

Dùng token trả về từ login với header:
```
Authorization: Bearer <token>
```

## API

### Users
| Method | Endpoint       | Quyền  |
|--------|---------------|--------|
| GET    | /users/me     | user   |
| PATCH  | /users/me     | user   |
| GET    | /users        | admin  |
| GET    | /users/:id    | admin  |
| PATCH  | /users/:id    | admin  |
| DELETE | /users/:id    | admin  |

### Categories
| Method | Endpoint          | Quyền  |
|--------|------------------|--------|
| GET    | /categories       | public |
| POST   | /categories       | admin  |
| PATCH  | /categories/:id   | admin  |
| DELETE | /categories/:id   | admin  |

### Books
| Method | Endpoint                  | Quyền  |
|--------|--------------------------|--------|
| GET    | /books                    | public |
| GET    | /books/:id                | public |
| POST   | /books                    | admin  |
| PATCH  | /books/:id                | admin  |
| DELETE | /books/:id                | admin  |
| POST   | /books/upload-cover       | admin  |

> Upload cover: form-data với field `image` và `bookId`

### Cart
| Method | Endpoint          | Quyền |
|--------|------------------|-------|
| GET    | /cart             | user  |
| POST   | /cart/items       | user  |
| PATCH  | /cart/items/:id   | user  |
| DELETE | /cart/items/:id   | user  |

### Orders
| Method | Endpoint              | Quyền |
|--------|-----------------------|-------|
| POST   | /orders               | user  |
| GET    | /orders/my-orders     | user  |
| GET    | /orders               | admin |
| PATCH  | /orders/:id/status    | admin |

### Reviews
| Method | Endpoint              | Quyền          |
|--------|-----------------------|----------------|
| GET    | /reviews/book/:bookId | public         |
| POST   | /reviews              | user           |
| PATCH  | /reviews/:id          | owner / admin  |
| DELETE | /reviews/:id          | owner / admin  |

### Authors
| Method | Endpoint       | Quyền  |
|--------|---------------|--------|
| GET    | /authors      | public |
| POST   | /authors      | admin  |
| PATCH  | /authors/:id  | admin  |
| DELETE | /authors/:id  | admin  |

### Wishlist
| Method | Endpoint           | Quyền |
|--------|--------------------|-------|
| GET    | /wishlist          | user  |
| POST   | /wishlist          | user  |
| DELETE | /wishlist/:bookId  | user  |

## Ví dụ payload

**Register:**
```json
{
  "name": "Kenji",
  "email": "kenji@example.com",
  "password": "123456"
}
```

**Create book:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 12.5,
  "stock": 20,
  "category_id": 1,
  "description": "Best practices"
}
```

**Create order:**
```json
{
  "shipping_address": "123 Nguyen Trai, HCMC"
}
```
