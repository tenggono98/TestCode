# Dokumentasi API

Base path: `http://localhost:{PORT}/api`

Autentikasi
- Login menggunakan Basic Auth pada endpoint `POST /api/auth/login`.
- Header contoh: `Authorization: Basic <base64(email:password)>` (contoh: `alfonso@gmail.com:password123`).
- Response: JSON berisi `accessToken`, `tokenType` (`Bearer`) dan `expiresIn`.
- Gunakan token pada header `Authorization: Bearer <accessToken>` untuk endpoint yang dilindungi.

Endpoint

- **POST /api/auth/login**
  - Auth: Basic
  - Request: Header `Authorization: Basic <base64(email:password)>`
  - Response 200:
    ```json
    {
      "accessToken": "<jwt>",
      "tokenType": "Bearer",
      "expiresIn": "<value from env>"
    }
    ```

- **GET /api/protected**
  - Auth: Bearer JWT
  - Request header: `Authorization: Bearer <token>`
  - Response 200: `{ message: "JWT access granted", user: { userId, roles, ... } }`

- **GET /api/products**
  - Auth: Bearer JWT
  - Response 200: List produk objek `{ id, name, price, qty }`
  - Contoh curl:
    ```bash
    curl -H "Authorization: Bearer <token>" http://localhost:3000/api/products
    ```

- **POST /api/orders**
  - Auth: Bearer JWT
  - Request body (JSON):
    ```json
    {
      "items": [
        { "productId": 1, "qty": 2 },
        { "productId": 2, "qty": 1 }
      ]
    }
    ```
  - Response 201: `{ "orderId": <number> }`
  - Catatan: script akan mengurangi `qty` pada tabel `products` sesuai `qty` yang dipesan.

- **GET /api/orders**
  - Auth: Bearer JWT
  - Response 200: List order `{ id, created_at, email }`

Errors umum
- 401 Unauthorized: saat header `Authorization` hilang atau token invalid/expired.
- 400/500: ditangani oleh `error.middleware` (cek log/middleware untuk detail).

Tips cepat
- Seed default user: `alfonso@gmail.com` dengan password `password123`.
- DB file: `data/app.db` (dibuat oleh script migrate/seed).

Jika mau, saya bisa:
- Menambahkan file OpenAPI/Swagger otomatis.
- Menambahkan contoh Postman collection.
