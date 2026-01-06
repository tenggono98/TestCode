# Docker Setup Guide

## Quick Start

Jalankan aplikasi dengan satu perintah:

```bash
docker-compose up
```

Proses startup otomatis:
1. Backend build & dependency installation
2. Frontend build & dependency installation
3. Database initialization (migrate & seed)
4. Backend starts on port 5000
5. Frontend starts on port 3000

Frontend akan tersedia di: **http://localhost:3000**
Backend akan tersedia di: **http://localhost:5000**

Default credentials:
- Email: `alfonso@gmail.com`
- Password: `password123`
- Role: ADMIN

## Prerequisites

- Docker dan Docker Compose sudah diinstall
- Versi minimum: Docker 20.10+ dan Docker Compose 1.29+

## Setup Environment Variables

Sudah dikonfigurasi otomatis dengan `.env.production` files:

### Backend (.env.production)
```dotenv
NODE_ENV=production
PORT=5000
JWT_SECRET=docker_production_secret_key_change_this_in_real_deployment
```

### Frontend (.env.production)
```dotenv
VITE_API_URL=http://backend:5000/api
```

Untuk development lokal, gunakan `.env` dan `.env.example` di masing-masing folder.

## Struktur Docker

### Services

1. Frontend (Port 3000)
   - React + Vite
   - Served dengan `serve`
   - Health check aktif

2. Backend (Port 5000)
   - Node.js + Express
   - SQLite3 Database
   - Health check aktif

### Database

Aplikasi menggunakan SQLite3 dengan better-sqlite3 driver:
- Database file: `TestCode-Backend/data/app.db`
- WAL mode enabled untuk better concurrency
- Auto-created on first run

## Commands Berguna

### Jalankan aplikasi
```bash
docker-compose up
```

### Jalankan di background
```bash
docker-compose up -d
```

### Lihat logs
```bash
docker-compose logs -f
```

### Lihat logs service tertentu
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop aplikasi
```bash
docker-compose down
```

### Rebuild images
```bash
docker-compose up --build
```

### Remove semua containers dan volumes
```bash
docker-compose down -v
```

## Troubleshooting

### Port sudah terpakai
Jika port 3000 atau 5000 sudah digunakan, modifikasi di `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Ubah port luar jika perlu
```

### Kontainer tidak bisa berkomunikasi
Pastikan kedua service menggunakan network yang sama (`testcode-network`).

### Build error
Jalankan dengan flag rebuild:
```bash
docker-compose up --build
```

### Clear cache
```bash
docker system prune -a
```

## Security Notes

**Jangan commit .env file ke Git!**

File `.gitignore` sudah dikonfigurasi untuk:
- Exclude `.env` files
- Exclude `node_modules/`
- Exclude build artifacts

Gunakan `.env.example` sebagai template untuk environment variables.

## Development Notes

- Frontend health check menggunakan wget
- Backend health check memanggil endpoint health
- Semua requests melalui internal network (secure)
- API URL dalam Docker: `http://backend:5000/api`

## Production Deployment

Untuk production:
1. Ganti `NODE_ENV=production` di backend
2. Update `JWT_SECRET` dengan nilai yang aman
3. Pertimbangkan menggunakan environment file terpisah (`.env.prod`)
4. Gunakan reverse proxy (nginx) di depan aplikasi
5. Setup SSL/TLS certificates

---

Untuk informasi lebih lanjut, lihat README di folder masing-masing service.
