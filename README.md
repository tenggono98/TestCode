# TestCode - Full Stack Application dengan Docker

Aplikasi full-stack demo untuk arsitektur microservices, REST API, dan containerization.

## Quick Start

```bash
docker-compose up
```

**Akses aplikasi:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Default Credentials:**
- Email: `alfonso@gmail.com`
- Password: `password123`

---

## Fitur Aplikasi

- Login - Autentikasi user dengan Basic Auth
- Lihat Produk - Tampilkan daftar semua produk
- Order Produk - Buat pesanan dengan validasi stok
- Riwayat Pesanan - Lihat history order user
- Database Auto-Init - SQLite3 migrate & seed otomatis
- Docker Setup - 1 command buat semua jalan
- Health Check - Monitoring kesehatan services
- Persistent Data - Database persist di volume

---

## Architecture

```
TestCode (Monolithic Frontend + Backend)
├── Frontend (React + Vite)
│   ├── Port: 3000
│   ├── Pages: Login, ProductList, OrderForm, OrderHistory
│   ├── Features: Client-side validation, Auth context
│   └── Tech: React 18, Vite, Tailwind CSS, Axios
│
└── Backend (Node.js + Express)
    ├── Port: 5000
    ├── Database: SQLite3 (better-sqlite3)
    ├── Features: REST API, JWT auth, input validation
    ├── Tech: Express.js, Bcryptjs, JWT
    └── Structure: MVC + Repository pattern
```

---

## Folder Structure

```
TestCode/
├── docker-compose.yml          ← Orchestrate semua services
├── DOCKER_SETUP.md             ← Docker documentation
│
├── TestCode-Frontend/          ← React + Vite (port 3000)
│   ├── Dockerfile
│   ├── .env.production         ← Config untuk Docker
│   ├── .gitignore
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         ← Login & register
│   │   │   ├── ProductList.jsx       ← Tampilkan produk
│   │   │   ├── OrderForm.jsx         ← Form order
│   │   │   └── OrderHistory.jsx      ← Riwayat order
│   │   ├── components/
│   │   │   ├── AuthProvider.jsx      ← Auth context
│   │   │   ├── RequireAuth.jsx       ← Protected routes
│   │   │   ├── NavBar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── api/index.js              ← Axios setup
│   │   └── utils/validation.js       ← Form validation
│   └── package.json
│
└── TestCode-Backend/           ← Express.js (port 5000)
    ├── Dockerfile
    ├── entrypoint.sh           ← Auto-init database
    ├── .env.production         ← Config untuk Docker
    ├── .gitignore
    ├── data/                   ← SQLite database
    ├── src/
    │   ├── server.js           ← Entry point
    │   ├── app.js              ← Express app
    │   ├── config/
    │   │   ├── env.js          ← Environment config
    │   │   └── jwt.js          ← JWT config
    │   ├── database/
    │   │   ├── index.js        ← DB connection
    │   │   ├── migrate.js      ← Create tables
    │   │   └── seed.js         ← Insert sample data
    │   ├── controllers/
    │   │   └── Controller.js   ← Base controller
    │   ├── repositories/
    │   │   └── Repository.js   ← Base repository
    │   ├── services/
    │   │   └── auth.service.js ← Auth logic
    │   ├── middleware/
    │   │   ├── basicAuth.middleware.js
    │   │   ├── jwtAuth.middleware.js
    │   │   └── error.middleware.js
    │   ├── modules/
    │   │   ├── products/       ← Products module
    │   │   │   ├── products.controller.js
    │   │   │   └── products.routes.js
    │   │   └── orders/         ← Orders module
    │   │       ├── orders.controller.js
    │   │       └── orders.routes.js
    │   ├── routes/
    │   │   ├── index.js
    │   │   ├── auth.routes.js
    │   │   └── protected.routes.js
    │   └── validators/
    │       └── inputValidator.js
    └── package.json
```

---

## API Endpoints

### Authentication (Basic Auth)
```
POST   /api/auth/login          ← Login user dengan email:password
```

**Login dengan Basic Auth:**
```bash
# Header Authorization: Basic base64(email:password)
# Contoh: Basic YWxmb25zb0BnbWFpbC5jb206cGFzc3dvcmQxMjM=

Response:
{
  "accessToken": "JWT_TOKEN",
  "tokenType": "Bearer",
  "expiresIn": "1h"
}
```

### Products
```
GET    /api/products            ← Ambil semua produk
GET    /api/products/:id        ← Ambil 1 produk
```

### Orders (Require JWT Token)
```
GET    /api/orders              ← Ambil semua order
GET    /api/orders/user/:id     ← Ambil order user tertentu
POST   /api/orders              ← Buat order baru
PUT    /api/orders/:id          ← Update order status
```

### Protected Routes
```
GET    /api/protected           ← Test JWT access
```

### Health
```
GET    /health                  ← Health check endpoint
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  roles TEXT NOT NULL
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  qty INTEGER NOT NULL DEFAULT 0
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## Docker Commands

### Start Application
```bash
# Run in foreground (lihat logs)
docker-compose up

# Run in background
docker-compose up -d

# Rebuild images
docker-compose up --build
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs real-time
docker-compose logs -f
```

### Stop Services
```bash
# Stop containers (preserve data)
docker-compose down

# Stop & remove all (reset)
docker-compose down -v
```

### Check Status
```bash
docker-compose ps
```

Untuk dokumentasi Docker lebih lengkap, lihat [DOCKER_SETUP.md](DOCKER_SETUP.md)

---

## Development Workflow

### 1. Login
```
User buka http://localhost:3000
→ Lihat login form
→ Input email & password
→ Frontend validate
→ POST /api/auth/login dengan Basic Auth
→ Backend: check email & password di database
→ Return JWT token
→ Frontend: save token ke localStorage & Authorization header
→ Redirect ke ProductList
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Authorization: Basic $(echo -n 'alfonso@gmail.com:password123' | base64)"
```

### 2. Product List
```
Setelah login, user lihat daftar produk
→ GET /api/products
→ Backend: query semua produk dari database
→ Frontend: render ProductCard component
```

### 3. Order Product
```
User klik "Order" di ProductCard
→ Buka OrderForm dengan product ID
→ User input quantity
→ Frontend validate: quantity > 0
→ POST /api/orders dengan product_id & qty
→ Backend: check stok, create order
→ Frontend: show success, redirect ke OrderHistory
```

### 4. Order History
```
GET /api/orders/user/:userId dengan JWT token
→ Backend: query orders untuk user
→ Frontend: tampilkan list orders dengan items
```

---

## Validation Strategy

### Frontend Validation (UX)
File: `TestCode-Frontend/src/utils/validation.js`

- `validateLogin()` - Email & password check
- `validatePassword()` - Min 6 karakter
- `validateQuantity()` - Quantity > 0

**Benefit:**
- Instant feedback saat user ketik
- Reduce server load
- Better UX

### Backend Validation (Security)
File: `TestCode-Backend/src/validators/inputValidator.js`

- Express-validator untuk check input
- Prevent tampering dari client
- Ensure data integrity di database

**Flow:**
```
User Input → Frontend Validation → Backend Validation → Database
```

---

## Startup Sequence

Saat jalankan `docker-compose up`:

1. **Build images** (first time only)
   - Frontend image build
   - Backend image build

2. **Start backend container**
   - Run `entrypoint.sh`
   - Execute `migrate.js` → create tables
   - Execute `seed.js` → insert sample data
   - Start Express server on port 5000
   - Health check: GET /health

3. **Wait for backend health check**
   - Docker verify backend ready

4. **Start frontend container**
   - Build React app
   - Start serve on port 3000
   - Health check: wget to http://localhost:3000

5. **Ready for use**
   - Frontend http://localhost:3000
   - Backend http://localhost:5000

---

## Common Issues

### Port already in use
```bash
docker-compose down
docker-compose up
```

### Database error
```bash
# Reset database
docker-compose down -v
docker-compose up
```

### Frontend can't connect to backend
- Check backend running: http://localhost:5000/health
- Check VITE_API_URL di `.env.production`
- Check CORS enabled di backend

### View detailed logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---


---

## Testing API

### Login dengan curl
```bash
# Method 1: Basic Auth Header
curl -X POST http://localhost:5000/api/auth/login \
  -H "Authorization: Basic $(echo -n 'alfonso@gmail.com:password123' | base64)"

# Response:
{
  "accessToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": "1h"
}
```

### Get Products
```bash
curl http://localhost:5000/api/products

# Response:
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 1500,
    "qty": 10
  },
  ...
]
```

### Protected Route (dengan JWT Token)
```bash
# Gunakan accessToken dari login
curl http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Browser Console
```javascript
// Login
const credentials = btoa('alfonso@gmail.com:password123');
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Authorization': 'Basic ' + credentials }
})
  .then(r => r.json())
  .then(d => {
    console.log('Token:', d.accessToken);
    localStorage.setItem('token', d.accessToken);
  })

// Get products
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(d => console.log(d))

// Get orders (dengan JWT)
fetch('http://localhost:5000/api/orders', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## Authentication

Backend menggunakan **Basic Auth** untuk login:
- Email: `alfonso@gmail.com`
- Password: `password123`

**Cara Kerja:**
1. User kirim email:password dalam format Base64
2. Backend verify di database
3. Return JWT token untuk request berikutnya
4. Frontend attach JWT token di Authorization header

---

## Next Steps

1. **Run aplikasi**
   ```bash
   docker-compose up
   ```

2. **Test di browser**
   - Go to http://localhost:3000
   - Register atau login

3. **Explore API**
   - Open DevTools Network tab
   - Lihat request/response

4. **Check logs**
   ```bash
   docker-compose logs -f
   ```

---

## Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend:**
- Node.js
- Express.js
- SQLite3 (better-sqlite3)
- JWT (jsonwebtoken)
- Bcryptjs

**DevOps:**
- Docker
- Docker Compose
- Alpine Linux

---

## Summary

Full-stack aplikasi yang demonstrate:
- Frontend-backend separation
- REST API design
- Authentication dengan JWT
- Database dengan SQLite3
- Docker containerization
- Docker Compose orchestration
- Validation (client & server)
- Error handling

**Mulai dengan:**
```bash
docker-compose up
```

Done! 🚀

