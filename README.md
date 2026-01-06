# TestCode - Full Stack dengan Docker

## Mulai Cepat

```bash
cd testcode-frontend
docker-compose up
```

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:5000

---

## Arsitektur Microservices

Aplikasi ini pakai **2 service terpisah** yang berkomunikasi via HTTP API.

### Service 1: Frontend (React)
- Port: 3000
- Tugas: UI, form, validasi client-side
- Tech: React + Vite + Tailwind
- Kirim request ke backend via axios

### Service 2: Backend (Express)
- Port: 5000
- Tugas: API, logic bisnis, validasi data
- Tech: Node.js + Express
- Return response JSON

### Communication Flow

```
Browser (user)
    ↓
Frontend di port 3000
    ↓ HTTP request (axios)
Backend di port 5000
    ↓
Process data
    ↓
Return JSON response
    ↓
Frontend render UI
```

---

## Folder Structure

```
testcode-frontend/              ← Frontend (port 3000)
├── docker-compose.yml          ← jalankan kedua service
├── Dockerfile                  ← image frontend
├── src/
│   ├── pages/                  ← LoginPage, ProductList, OrderForm
│   ├── components/             ← NavBar, ProductCard, RequireAuth
│   ├── api/index.js            ← setup axios untuk API
│   ├── utils/validation.js     ← validasi form
│   └── App.jsx
└── package.json

testcode-backend/               ← Backend (port 5000)
├── Dockerfile                  ← image backend
├── src/
│   ├── server.js               ← entry point
│   ├── controllers/            ← ProductController, OrderController
│   ├── repositories/           ← ProductRepository, OrderRepository
│   ├── routes/index.js         ← API endpoints
│   └── validators/             ← validasi input
└── package.json
```

---

## API Endpoints

**Backend expose 11 endpoints:**

```
Produk:
  GET    /api/products           → ambil semua
  GET    /api/products/:id       → ambil 1 produk
  POST   /api/products           → buat baru
  PUT    /api/products/:id       → update
  DELETE /api/products/:id       → hapus

Pesanan:
  GET    /api/orders             → ambil semua
  GET    /api/orders/user/:id    → pesanan user tertentu
  POST   /api/orders             → buat pesanan
  PUT    /api/orders/:id         → update status

Auth:
  POST   /api/auth/register      → daftar user
  POST   /api/auth/login         → login user

Health:
  GET    /health                 → cek server jalan
```

---

## Backend Architecture (MVC + Repository)

### Routes (src/routes/index.js)
Define endpoints dan middleware validation.

```javascript
router.post('/api/products', validateProduct, handleValidationErrors, 
  (req, res) => productController.createProduct(req, res)
);
```

### Controllers (src/controllers/Controller.js)
Handle business logic.

```javascript
class ProductController {
  async createProduct(req, res) {
    const product = await this.productRepository.create(req.body);
    res.status(201).json({ success: true, data: product });
  }
}
```

### Repositories (src/repositories/Repository.js)
Akses data (database, cache, file, dll).

```javascript
class ProductRepository {
  async create(data) {
    const newProduct = { id: uuidv4(), ...data };
    products.push(newProduct);
    return newProduct;
  }
}
```

### Validators (src/validators/inputValidator.js)
Check input valid sebelum masuk ke controller.

```javascript
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Nama harus diisi'),
  body('price').isFloat({ min: 0.01 }).withMessage('Harga harus > 0'),
];
```

**Flow:**
```
Request → Validator → Controller → Repository → Database → Response
```

---

## Frontend Validation (src/utils/validation.js)

Check user input langsung saat user ketik, biar UX lebih baik.

```javascript
export const validateLogin = (formData) => {
  const errors = {};
  if (!formData.email) errors.email = 'Email harus diisi';
  if (formData.password.length < 6) errors.password = 'Min 6 karakter';
  return Object.keys(errors).length ? errors : null;
}
```

**Double-layer validation:**
1. Frontend → immediate feedback (UX bagus)
2. Backend → data integrity (security)

---

## Docker Compose (docker-compose.yml)

```yaml
services:
  frontend:
    - Port 3000
    - Depends on: backend
    - Health check: wget to localhost:3000

  backend:
    - Port 5000
    - Health check: GET /health
    - In-memory database

networks:
  testcode-network:  ← connect kedua service
```

**Jalankan:**
```bash
docker-compose up        # jalankan
docker-compose down      # stop
docker-compose logs -f   # liat log
```

---

## Komunikasi Frontend-Backend

**Frontend kirim request:**
```javascript
// src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// pakai di component
const response = await api.get('/api/products');
```

**Backend terima & response:**
```javascript
app.get('/api/products', (req, res) => {
  const products = await productRepository.findAll();
  res.json({ success: true, data: products });
});
```

---

## Contoh: Bikin Produk Baru

### 1. Frontend (LoginPage.jsx)
User klik form "Buat Produk", isi nama, harga, stok.

### 2. Frontend Validasi
```javascript
const errors = validateProduct(formData);
if (errors) return showError(errors);  // stop kalau invalid
```

### 3. Frontend Kirim API
```javascript
const response = await api.post('/api/products', formData);
// POST http://localhost:5000/api/products
```

### 4. Backend Terima
- Route: `/api/products` catch POST request
- Validator: check inputnya valid
- Controller: handle logic
- Repository: save ke data store
- Response: return JSON { success: true, data: {...} }

### 5. Frontend Terima Response
```javascript
setSuccess('Produk berhasil dibuat!');
setProducts([...products, response.data.data]);
```

---

## Data Model

```javascript
Product {
  id: string,           // unique
  name: string,         // min 3 karakter
  price: number,        // > 0
  stock: number,        // >= 0
  description: string,
  createdAt: Date
}

Order {
  id: string,
  userId: string,
  items: [
    { productId: string, quantity: number }
  ],
  status: 'pending' | 'completed',
  createdAt: Date
}

User {
  id: string,
  email: string,        // valid email
  password: string,     // min 6 karakter
  name: string,
  createdAt: Date
}
```

---

## Scaling ke Production

### Sekarang (Development)
- In-memory data (hilang saat restart)
- Monolithic backend
- No authentication
- No database

### Production Roadmap

**Database:**
Replace Repository implementation
```javascript
// Dari in-memory array
let products = [];

// Ke database
const Product = require('./models/Product');
const products = await Product.find();
```

**Split Microservices:**
```
Frontend → API Gateway
           ├── Product Service (port 5001)
           ├── Order Service (port 5002)
           └── Auth Service (port 5003)
```

**Kubernetes:**
```
Pod Frontend (replicas: 3)
Pod Backend (replicas: 3)
Pod Database (mongodb)
```

---

## Testing API

**Pake curl:**
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999,"stock":5}'
```

**Pake browser console:**
```javascript
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(d => console.log(d));
```

---

## Development Checklist

- [ ] `docker-compose up` → kedua service jalan
- [ ] Buka http://localhost:3000 → frontend load
- [ ] Buka http://localhost:5000/health → backend respond
- [ ] Bikin produk via UI
- [ ] Cek `docker-compose logs` → liat flow request

---

## File Penting

| File | Untuk Apa |
|------|-----------|
| `docker-compose.yml` | Jalankan frontend + backend |
| `src/server.js` | Backend entry point |
| `src/controllers/Controller.js` | Business logic |
| `src/repositories/Repository.js` | Akses data |
| `src/routes/index.js` | API endpoints |
| `src/api/index.js` | Frontend API client |
| `src/utils/validation.js` | Frontend validasi |

---

## Environment Config

**Backend** - `testcode-backend/.env`
```
PORT=5000
NODE_ENV=development
JWT_SECRET=secret_change_later
```

**Frontend** - `testcode-frontend/.env`
```
VITE_API_URL=http://localhost:5000
```

---

## Common Issues

### Port sudah terpakai
```bash
docker-compose down
docker-compose up
```

### npm error
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Frontend error (server connection)
- Check backend jalan: `curl http://localhost:5000/health`
- Check VITE_API_URL benar di `.env`
- Check CORS enabled di backend

### Liat log detail
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Apa yang Dipelajari

Microservices architecture (frontend & backend terpisah)
RESTful API design
MVC + Repository pattern
Frontend-backend communication
Validation strategy (client & server)
Docker containerization
Docker Compose orchestration
Error handling & HTTP status codes  

---

## Next Steps

1. **Jalankan:** `docker-compose up`
2. **Test:** Bikin produk di http://localhost:3000
3. **Explore:** Buka network tab di DevTools → liat API calls
4. **Extend:** Tambah endpoint baru di backend
5. **Deploy:** Upgrade ke real database

---

## Summary

Ini adalah **demo full-stack microservices** yang bisa langsung jalan dengan 1 command. 

Frontend & backend **completely terpisah**, berkomunikasi lewat HTTP API. Perfect buat belajar architecture modern!

**Mulai dengan:**
```bash
cd testcode-frontend
docker-compose up
```

Done!

### Menjalankan aplikasi dengan Docker Compose (Recommended)

```bash
# Navigate to frontend folder
cd testcode-frontend

# Start both services with one command
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Akses aplikasi:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### Development Mode (tanpa Docker)

**Frontend:**
```bash
cd testcode-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd testcode-backend
npm install
npm run dev
# Runs on http://localhost:5000
```

## Project Structure

```
testcode-frontend/                    # Frontend React + Vite
├── src/
│   ├── components/                  # Reusable components
│   │   ├── AuthProvider.jsx
│   │   ├── NavBar.jsx
│   │   ├── ProductCard.jsx
│   │   └── RequireAuth.jsx
│   ├── pages/                       # Page components
│   │   ├── LoginPage.jsx
│   │   ├── OrderForm.jsx
│   │   ├── OrderHistory.jsx
│   │   └── ProductList.jsx
│   ├── utils/
│   │   ├── validation.js            # Client-side validation
│   │   └── index.js
│   ├── api/
│   │   └── index.js                 # Axios configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile                        # Frontend container config
├── docker-compose.yml               # Orchestration file
├── package.json
├── vite.config.js
└── README.md

testcode-backend/                    # Backend Express.js
├── src/
│   ├── controllers/                 # Business logic
│   │   └── Controller.js
│   ├── repositories/                # Data access layer
│   │   └── Repository.js
│   ├── routes/                      # API endpoints
│   │   └── index.js
│   ├── validators/                  # Input validation
│   │   └── inputValidator.js
│   ├── middleware/                  # Express middleware
│   ├── models/                      # Data models
│   ├── config/                      # Configuration
│   └── server.js                    # Entry point
├── Dockerfile                        # Backend container config
├── package.json
├── .env                             # Environment variables
└── README.md
```

## Architecture

### Design Patterns

#### 1. MVC (Model-View-Controller)
- **Routes**: Mendefinisikan endpoints
- **Controllers**: Business logic
- **Models/Repositories**: Data access layer
- **Validators**: Input validation

#### 2. Repository Pattern
Abstraksi data access untuk fleksibilitas:
```
Controller → Repository → Database
```

### Teknologi Stack

**Frontend:**
- React 18.2
- Vite (fast build tool)
- Tailwind CSS
- axios (HTTP client)
- React Router

**Backend:**
- Express.js
- Node.js
- express-validator
- UUID
- CORS

### Communication Flow

```
Browser (Port 3000)
    ↓
    axios client
    ↓
Backend API (Port 5000)
    ↓
Express Routes
    ↓
Controllers (business logic)
    ↓
Repositories (data access)
    ↓
In-memory data
```

## API Endpoints

API endpoints yang berbeda dari sebelumnya

### Products
```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get product by ID
POST   /api/products              # Create product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product
```

**Example Request:**
```bash
curl http://localhost:5000/api/products
```

### Orders
```
GET    /api/orders                # Get all orders
GET    /api/orders/user/:userId   # Get user's orders
POST   /api/orders                # Create order
PUT    /api/orders/:id            # Update order
```

### Authentication
```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # User login
```

## Validation

### Frontend Validation (Instant feedback)
File: `src/utils/validation.js`

```javascript
validateLogin(formData)           // Email & password validation
validateRegister(formData)        // Registration validation
validateProduct(product)          // Product validation
validateQuantity(qty)             // Order quantity validation
```

### Backend Validation (Data integrity)
File: `src/validators/inputValidator.js`

```javascript
validateProduct                   // Product validation rules
validateOrder                     // Order validation rules
validateUser                      // User validation rules
handleValidationErrors            // Error middleware
```

### Double-Layer Validation Strategy

```
User Input → Frontend Validation → Backend Validation → Database

Frontend:
- Instant user feedback
- Reduce server load
- Better UX

Backend:
- Prevent invalid data from database
- Security (prevent tampering)
- API contract enforcement
```

## Environment Setup

### Frontend Environment Variables

Create `.env` in `testcode-frontend/`:
```
VITE_API_URL=http://localhost:5000
```

### Backend Environment Variables

Create `.env` in `testcode-backend/`:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_in_production
```

## Docker Commands

### Build Images
```bash
docker-compose build
```

### Start Services
```bash
# Foreground
docker-compose up

# Background
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend

# Follow logs
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

### Check Service Status
```bash
docker-compose ps
```

## Testing API

### Using curl

```bash
# Get all products
curl http://localhost:5000/api/products

# Get specific product
curl http://localhost:5000/api/products/1

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"stock":5}'

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "items":[{"productId":"1","quantity":2}]
  }'
```

### Using Browser Console

```javascript
// Test API
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(d => console.log(d))

// Create order
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-123',
    items: [{ productId: 'prod-1', quantity: 2 }]
  })
})
```

## Workflow

### Creating a Product

1. **User fills form in Frontend**
   - Frontend validation runs immediately
   - Shows error messages if invalid

2. **Form submitted**
   - axios sends POST request to backend
   - Backend validates request again

3. **Backend processes**
   - Controller receives request
   - Repository creates product
   - Returns created product

4. **Frontend displays result**
   - Success message shown
   - Product list refreshed

## Data Models

### Product
```javascript
{
  id: string,           // UUID
  name: string,         // Product name (required, min 3 chars)
  price: number,        // Price (required, > 0)
  description: string,  // Optional
  stock: number,        // Stock quantity (required, >= 0)
  createdAt: Date       // Creation timestamp
}
```

### Order
```javascript
{
  id: string,           // UUID
  userId: string,       // User ID
  items: [
    {
      productId: string,    // Product ID
      quantity: number      // Order quantity
    }
  ],
  status: string,       // 'pending' | 'completed' | 'cancelled'
  createdAt: Date       // Creation timestamp
}
```

### User
```javascript
{
  id: string,           // UUID
  email: string,        // Email (required, valid format)
  password: string,     // Password (required, min 6 chars)
  name: string,         // User name (required, min 3 chars)
  createdAt: Date       // Creation timestamp
}
```

## Security Features

- CORS configuration
- Input validation (frontend & backend)
- Error handling
- Health check endpoints
- JWT authentication (planned)
- Password hashing (planned)
- Rate limiting (planned)

## Future Enhancements

### Database
```javascript
// Replace in-memory storage with real database
const product = await Product.findById(id);          // MongoDB
const orders = await db.query('SELECT * FROM orders'); // PostgreSQL
```

### Authentication
```javascript
// JWT tokens
const token = jwt.sign({ userId }, process.env.JWT_SECRET);

// Password hashing
const hashedPassword = await bcrypt.hash(password, 10);
```

### Microservices
```
API Gateway
    ↓
├── Product Service
├── Order Service
├── User Service
└── Payment Service
```

### Caching
```javascript
// Redis caching
const product = await redis.get('product:1');
```

### Logging
```javascript
// Winston or Pino
logger.info('Product created', { productId });
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild image
docker-compose down
docker-compose up --build
```

### Network Issues
```bash
# Check if services can communicate
docker-compose exec frontend ping backend

# Verify network
docker network ls
docker network inspect testcode-network
```


---

