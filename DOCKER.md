# 🐳 Docker Setup & Usage Guide

Hướng dẫn chi tiết sử dụng Docker để triển khai ứng dụng.

## 📋 Mục Lục

- [Cài Đặt](#cài-đặt)
- [Cấu Trúc Docker](#cấu-trúc-docker)
- [Sử Dụng Cơ Bản](#sử-dụng-cơ-bản)
- [Development vs Production](#development-vs-production)
- [Advanced](#advanced)

---

## 🔧 Cài Đặt

### Windows

1. **Tải Docker Desktop**
   - Truy cập: https://www.docker.com/products/docker-desktop
   - Chọn Windows version (Intel hoặc Apple Silicon)
   - Cài đặt

2. **Kiểm Tra Cài Đặt**
   ```bash
   docker --version
   docker-compose --version
   ```

3. **Khởi Động Docker**
   - Mở Docker Desktop
   - Chờ Docker daemon khởi động

### Mac & Linux

```bash
# Mac - Homebrew
brew install docker docker-compose

# Linux - apt
sudo apt-get install docker.io docker-compose

# Kiểm Tra
docker --version
docker-compose --version
```

---

## 📦 Cấu Trúc Docker

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY server.js ./
COPY models/ ./models/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
```

**Giải Thích:**
- `FROM node:18-alpine` - Image Node.js nhẹ (Alpine Linux)
- `WORKDIR /app` - Đặt thư mục làm việc
- `COPY` - Copy files từ máy host
- `RUN npm ci` - Install dependencies (production only)
- `EXPOSE 3000` - Khai báo port
- `HEALTHCHECK` - Kiểm tra sức khỏe container
- `CMD` - Lệnh khởi động

### Dockerfile.frontend (Frontend)

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
```

**Giải Thích:**
- Multi-stage build: Builder stage build code, Production stage serve
- Builder: Node.js compile React code → dist/
- Production: Nginx serve static files từ dist/

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: app-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  server:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: app-server
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/image_finder
      PORT: 3000
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - app-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: app-frontend
    ports:
      - "3001:3001"
    depends_on:
      - server
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
```

---

## 🚀 Sử Dụng Cơ Bản

### Khởi Động Tất Cả Services

```bash
cd /path/to/project

# Build images (lần đầu hoặc khi có thay đổi)
docker-compose build

# Chạy containers
docker-compose up -d

# Kiểm tra status
docker-compose ps
```

**Output:**
```
NAME              STATUS           PORTS
app-mongodb       Up 2 minutes     27017/tcp
app-server        Up 1 minute      3000/tcp
app-frontend      Up 30 seconds    3001/tcp
```

### Truy Cập Ứng Dụng

```bash
# Frontend
http://localhost:3001

# Backend API
http://localhost:3000/api/images

# Health Check
http://localhost:3000/health

# MongoDB (từ container khác)
mongodb://admin:password@localhost:27017/image_finder
```

### Quản Lý Containers

```bash
# Xem logs
docker-compose logs -f

# Logs từ service cụ thể
docker-compose logs -f server
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Dừng containers
docker-compose stop

# Khởi động lại
docker-compose restart

# Xóa containers (giữ volumes)
docker-compose down

# Xóa hoàn toàn (xóa cả volumes)
docker-compose down -v

# Xóa images
docker-compose down --rmi all
```

---

## 🔄 Development vs Production

### Development Mode

```bash
# Sử dụng file override
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Hoặc với volumes để hot-reload
volumes:
  - ./src:/app/src
  - ./server.js:/app/server.js
```

**docker-compose.dev.yml:**

```yaml
version: '3.8'

services:
  server:
    volumes:
      - ./server.js:/app/server.js
      - ./models:/app/models
    environment:
      NODE_ENV: development
    command: npm run dev

  frontend:
    volumes:
      - ./src:/app/src
      - ./components:/app/components
    environment:
      VITE_API_URL: http://localhost:3000/api
```

### Production Mode

```bash
# Build optimized
docker-compose build --no-cache

# Chạy
docker-compose up -d

# Kiểm tra resources
docker stats
```

---

## 🔐 Security Best Practices

### Environment Variables

**Tạo .env.example:**

```env
MONGODB_URI=
MONGO_USERNAME=
MONGO_PASSWORD=
PORT=
NODE_ENV=
```

**Sử dụng .env:**

```bash
# Tạo .env từ example
cp .env.example .env

# Cập nhật giá trị
# KHÔNG commit .env vào git
```

### Image Security

```bash
# Scan cho vulnerabilities
docker scan app-backend
docker scan app-frontend

# Update base images
docker pull node:18-alpine
docker pull nginx:alpine

# Rebuild
docker-compose build --no-cache
```

### Network Isolation

```yaml
networks:
  app-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 📊 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats

# CPU usage
docker stats --no-stream
```

### Logs Management

```bash
# Xem logs (recent)
docker-compose logs --tail=100

# Follow logs
docker-compose logs -f

# Timestamps
docker-compose logs --timestamps

# Service cụ thể
docker-compose logs server --tail=50
```

### Health Checks

```bash
# Check container health
docker ps --format "{{.Names}}\t{{.Status}}"

# Test endpoint
curl http://localhost:3000/health
curl http://localhost:3001

# MongoDB health
docker exec app-mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 🆘 Troubleshooting

### Container không khởi động

```bash
# Xem logs chi tiết
docker-compose logs server

# Rebuild từ đầu
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Port Conflict

```bash
# Tìm port nào đang dùng
netstat -tulpn | grep LISTEN

# Thay đổi port trong docker-compose.yml
ports:
  - "3000:3000"  # "host_port:container_port"
```

### MongoDB Connection Error

```bash
# Check MongoDB running
docker-compose ps mongodb

# Test connection
docker exec app-mongodb mongosh

# Kiểm tra network
docker network inspect app-network
```

### Disk Space Issue

```bash
# Xóa unused images/containers
docker system prune

# Xóa với volumes
docker system prune -a --volumes
```

---

## 🔗 Links Liên Quan

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Alpine Images](https://hub.docker.com/_/node)
- [Nginx Official Images](https://hub.docker.com/_/nginx)
- [MongoDB Official Images](https://hub.docker.com/_/mongo)
