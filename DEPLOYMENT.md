# 🚀 Deployment Guide

Hướng dẫn triển khai ứng dụng cho cả Client và Server cùng một lúc.

## 📋 Mục Lục

- [Deployment với Docker](#deployment-với-docker)
- [Deployment Local](#deployment-local)
- [Deployment trên Cloud](#deployment-trên-cloud)
- [Troubleshooting](#troubleshooting)

---

## 🐳 Deployment với Docker

### Yêu Cầu

- Docker Desktop (v20.10+)
- Docker Compose (v1.29+)

### Cấu Hình

#### 1. Chuẩn bị Environment

```bash
cp .env.example .env
```

**Cập nhật `.env` với cấu hình production:**

```env
# MongoDB
MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/image_finder?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=your_secure_password

# Server
PORT=3000
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:3000/api
```

#### 2. Xây Dựng và Chạy

```bash
# Build images
docker-compose build

# Chạy ứng dụng
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f
```

#### 3. Truy Cập Ứng Dụng

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

#### 4. Dừng Ứng Dụng

```bash
docker-compose down

# Xóa volumes (cảnh báo: sẽ xóa dữ liệu)
docker-compose down -v
```

---

## 🖥️ Deployment Local (Production Build)

### Yêu Cầu

- Node.js 18+
- MongoDB (local hoặc remote)
- npm

### Cấu Hình

#### 1. Chuẩn Bị Environment

```bash
cp .env.example .env
```

**Cập nhật `.env`:**

```env
MONGODB_URI=mongodb://localhost:27017/image_finder
PORT=3000
NODE_ENV=production
```

#### 2. Build Frontend

```bash
npm run build

# Output: dist/
```

#### 3. Chạy Backend và Frontend

**Tùy Chọn A: Chạy Riêng (Development)**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend (Preview)
npm run preview
```

**Tùy Chọn B: Chạy Đồng Thời**

```bash
npm run start:full
```

#### 4. Kiểm Tra

```bash
# Backend health check
curl http://localhost:3000/health

# Frontend
http://localhost:3001

# API
curl http://localhost:3000/api/images
```

### Sử Dụng PM2 (Process Manager)

#### Cài Đặt PM2

```bash
npm install -g pm2
```

#### Tạo ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log'
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

#### Chạy với PM2

```bash
# Khởi động
pm2 start ecosystem.config.js

# Kiểm tra status
pm2 status

# Xem logs
pm2 logs

# Restart
pm2 restart all

# Stop
pm2 stop all

# Delete
pm2 delete all
```

---

## ☁️ Deployment trên Cloud

### Heroku

#### 1. Cài Đặt Heroku CLI

```bash
# Windows
choco install heroku-cli

# Đăng nhập
heroku login
```

#### 2. Tạo Ứng Dụng

```bash
heroku create your-app-name
```

#### 3. Thêm MongoDB (MongoDB Atlas)

```bash
# Lấy connection string từ MongoDB Atlas
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set NODE_ENV=production
```

#### 4. Deploy

```bash
git push heroku main
```

#### 5. Kiểm Tra

```bash
heroku logs --tail
heroku open
```

### Vercel (Frontend Only)

#### 1. Cài Đặt Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy Frontend

```bash
vercel
```

#### 3. Cấu Hình Environment

```bash
vercel env add VITE_API_URL
# Nhập: https://your-backend.herokuapp.com
```

### Railway / Render

Tương tự Heroku, các nền tảng này hỗ trợ Docker deployment trực tiếp.

---

## 🔧 Nginx Reverse Proxy (Linux/Mac)

Nếu chạy trên server riêng:

#### 1. Cài Đặt Nginx

```bash
sudo apt-get install nginx
```

#### 2. Cấu Hình Nginx

```bash
sudo nano /etc/nginx/sites-available/image-finder
```

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:3001;
}

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. Kích Hoạt

```bash
sudo ln -s /etc/nginx/sites-available/image-finder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoring & Logging

### Docker

```bash
# Xem logs
docker-compose logs -f server
docker-compose logs -f frontend

# Stats
docker stats
```

### PM2

```bash
# Dashboard
pm2 monit

# Logs
pm2 logs backend
pm2 logs frontend
```

### Logs với ELK Stack (Optional)

Tạo `docker-compose.yml` với ELK:

```yaml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0

kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0

logstash:
  image: docker.elastic.co/logstash/logstash:8.0.0
```

---

## 🛡️ Security Checklist

- [ ] Cấu hình HTTPS/SSL
- [ ] Sử dụng biến môi trường cho secrets
- [ ] Kích hoạt CORS chỉ cho domains được phép
- [ ] Rate limiting trên API endpoints
- [ ] Backup MongoDB định kỳ
- [ ] Monitoring & alerting
- [ ] Regular dependency updates

---

## 🐛 Troubleshooting

### Port đã được sử dụng

```bash
# Windows - Tìm process sử dụng port 3000
netstat -ano | findstr :3000

# Tắt process
taskkill /PID <PID> /F
```

### MongoDB Connection Error

```bash
# Kiểm tra MongoDB running
mongosh

# Test connection string
mongosh "mongodb://admin:password@localhost:27017/image_finder?authSource=admin"
```

### Docker Build Fails

```bash
# Clear cache
docker-compose build --no-cache

# Kiểm tra logs
docker-compose logs
```

### Frontend không kết nối Backend

```bash
# Kiểm tra API URL trong frontend
# http://localhost:3000/api

# Test API endpoint
curl http://localhost:3000/api/images

# Kiểm tra CORS headers
curl -i http://localhost:3000/api/images
```

---

## 📚 Tài Liệu Liên Quan

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn cấu hình
- [QUICK_START.md](./QUICK_START.md) - Khởi động nhanh
- [DOCKER.md](./DOCKER.md) - Chi tiết Docker
- [README.md](./README.md) - Giới thiệu dự án
