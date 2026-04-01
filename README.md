# Bookstore RESTful API

Node.js RESTful API cho web bán sách cơ bản, dùng MySQL, JWT auth/autho, upload ảnh local.

## Cấu trúc thư mục

- `bin/`
- `controllers/`
- `routes/`
- `schemas/`
- `uploads/`
- `utils/`
- `app.js`

## Cài đặt

1. Cài dependency:
   - `npm install`
2. Tạo file `.env` từ `.env.example` và điền thông tin MySQL.
3. Tạo database MySQL trước (ví dụ: `bookstore_db`).
4. Chạy server:
   - dev: `npm run dev`
   - production: `npm start`

Khi server khởi động, hệ thống sẽ tự tạo bảng nếu chưa tồn tại.

## Danh sách model

- `user`
- `category`
- `book`
- `cart`
- `order`
- `review`

## Auth

- `POST /auth/register`
- `POST /auth/login`

Sử dụng token trả về ở login với header:
- `Authorization: Bearer <token>`

## API chính

- Users:
  - `GET /users/me`
  - `PATCH /users/me`
  - `GET /users` (admin)
  - `GET /users/:id` (admin)
  - `PATCH /users/:id` (admin)
  - `DELETE /users/:id` (admin)
- Categories:
  - `GET /categories`
  - `POST /categories` (admin)
  - `PATCH /categories/:id` (admin)
  - `DELETE /categories/:id` (admin)
- Books:
  - `GET /books`
  - `GET /books/:id`
  - `POST /books` (admin)
  - `PATCH /books/:id` (admin)
  - `DELETE /books/:id` (admin)
  - `POST /books/upload-cover` (admin, form-data key: `image`, field `bookId`)
- Cart:
  - `GET /cart`
  - `POST /cart/items`
  - `PATCH /cart/items/:id`
  - `DELETE /cart/items/:id`
- Orders:
  - `POST /orders`
  - `GET /orders/my-orders`
  - `GET /orders` (admin)
  - `PATCH /orders/:id/status` (admin)
- Reviews:
  - `GET /reviews/book/:bookId`
  - `POST /reviews` (user login)
  - `PATCH /reviews/:id` (owner or admin)
  - `DELETE /reviews/:id` (owner or admin)

## Ví dụ payload

- Register:
```json
{
  "name": "Kenji",
  "email": "kenji@example.com",
  "password": "123456"
}
```

- Create book:
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

- Create order:
```json
{
  "shipping_address": "123 Nguyen Trai, HCMC"
}
```
