# Setup Railpack Deployment Guide

## ✅ Setup hoàn tất cho Railpack

Bạn đã cấu hình thành công project để deploy cả **Frontend (React + Vite)** và **Backend (Node.js Express)** trên Railpack.

## 📋 Các thay đổi đã làm:

### 1. **package.json**
   - Cập nhật script `start` để chỉ chạy `node server.js`
   - Railpack tự động nhận diện `start` script

### 2. **Dockerfile**
   - Multi-stage build: Frontend build → Backend serve
   - Vite build output → `public/` folder
   - Express serve static files + API routes

### 3. **server.js**
   - Thêm serving static frontend files từ `public/` folder
   - Thêm fallback route cho SPA (Single Page Application)
   - API routes vẫn hoạt động bình thường tại `/api/*`

### 4. **vite.config.ts**
   - Build output thành `public/` folder thay vì `dist/`
   - Đảm bảo frontend được serve đúng từ backend

### 5. **.railwayignore**
   - Xác định files không cần upload lên Railway

## 🚀 Cách Deploy lên Railway (Railpack):

### Bước 1: Connect GitHub
```bash
# Push code lên GitHub (nếu chưa)
git add .
git commit -m "Setup Railpack deployment"
git push origin main
```

### Bước 2: Connect Railway
1. Vào https://railway.app
2. Click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Select repository: `BinhMyDisplay`
5. Railway tự động detect Node.js project

### Bước 3: Cấu hình Environment Variables
Thêm variables trong Railway:
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Bước 4: Deploy
- Railway tự động:
  1. Install dependencies: `npm ci --only=production`
  2. Build frontend: `npm run build`
  3. Start server: `npm start` (chạy `node server.js`)
  4. Serve frontend + API trên port 3001

## 📁 Folder Structure sau deploy:
```
/app
├── server.js              (Express backend)
├── models/                (MongoDB schemas)
├── package.json
├── public/                (Built frontend từ Vite)
│   ├── index.html
│   ├── assets/
│   └── ...
└── node_modules/
```

## ✔️ Làm thế nào để kiểm tra:

### Local Development:
```bash
# Build frontend
npm run build

# Start server (serve frontend + API)
npm start

# Truy cập: http://localhost:3001
```

### Production (Railway):
- Frontend: `https://your-railway-app.railway.app`
- API: `https://your-railway-app.railway.app/api/*`

## 🔧 API Routes vẫn hoạt động:
- `GET /api/images` - Lấy danh sách ảnh
- `GET /api/images/:id` - Lấy ảnh theo ID
- `POST /api/images` - Tạo ảnh mới
- `PUT /api/images/:id` - Cập nhật ảnh
- `DELETE /api/images/:id` - Xóa ảnh
- `GET /health` - Health check

## 🎯 Ưu điểm của Railpack:
✅ Deploy tự động từ GitHub
✅ Auto scaling
✅ Built-in PostgreSQL, MongoDB support
✅ Zero downtime deployments
✅ Logging & monitoring
✅ Free tier khá generous

## ⚠️ Lưu ý:
- Ensure `package-lock.json` được commit vào Git
- Environment variables phải được set trên Railway dashboard
- MongoDB connection string phải accessible từ Railway servers
- Build time có thể 5-10 phút cho lần deploy đầu

---

Bây giờ bạn có thể deploy trực tiếp từ GitHub lên Railway! 🎉
