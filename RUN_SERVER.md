# 🚀 HƯỚNG DẪN CHẠY BACKEND SERVER

## Cấu Trúc Mới

App đã được tách thành **Frontend + Backend**:

```
Frontend (Vite + React)    ←→    Backend (Express + MongoDB)
   :5173                              :3001
```

## Cách Chạy

### Cách 1: Chạy Cả Frontend & Backend Cùng Lúc

```bash
npm run dev:full
```

Điều này sẽ chạy:
- **Backend**: `http://localhost:3001` 
- **Frontend**: `http://localhost:5173`

### Cách 2: Chạy Riêng Lẻ

**Terminal 1 - Backend:**
```bash
npm run server
```

Kết quả:
```
✓ Backend server running on http://localhost:3001
✓ API endpoint: http://localhost:3001/api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Kết quả:
```
✓ VITE v6.2.0 ready in 234 ms
✓ Local: http://localhost:5173/
```

### Cách 3: Development (Giả Lập Backend)

Nếu chỉ muốn chạy Frontend (không cần Backend):

```bash
npm run dev
```

Frontend sẽ sử dụng **dữ liệu giả lập** (mock data) nếu backend không chạy.

## 📋 Kiểm Tra

Mở terminal và kiểm tra:

```bash
# Kiểm tra backend chạy không
curl http://localhost:3001/health

# Kết quả nếu OK:
# {"status":"OK","message":"Backend server is running"}
```

## 🔌 API Endpoints

Backend cung cấp các API:

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/api/images?limit=20` | Lấy 20 ảnh mới nhất |
| GET | `/api/images/:id` | Lấy ảnh theo ID |
| POST | `/api/images` | Tạo ảnh mới |
| PUT | `/api/images/:id` | Cập nhật ảnh |
| DELETE | `/api/images/:id` | Xóa ảnh |
| GET | `/health` | Kiểm tra server |

## 🔧 Cấu Hình

File `server.js` sử dụng các biến môi trường:

```
MONGODB_URI=mongodb://localhost:27017/ai-image-finder
PORT=3001
```

Chúng đã được thiết lập mặc định, không cần thay đổi.

## ⚠️ Lỗi Thường Gặp

### Lỗi 1: Port 3001 bận
```bash
# Tìm process đang sử dụng port 3001 và kill
netstat -ano | findstr :3001

# Kill process (thay PID bằng số process)
taskkill /PID <PID> /F
```

### Lỗi 2: CORS Error
Nếu frontend không kết nối backend, kiểm tra:
- Backend chạy chưa: `curl http://localhost:3001/health`
- VITE_API_URL trong `.env` có chính xác không

### Lỗi 3: MongoDB connection error
```bash
# Kiểm tra MongoDB chạy chưa
mongod

# Hoặc dùng MongoDB Atlas (cloud)
# Cập nhật MONGODB_URI trong .env
```

## 📚 Tóm Tắt

1. **Chạy MongoDB** (nếu dùng local)
   ```bash
   mongod
   ```

2. **Chạy Backend + Frontend**
   ```bash
   npm run dev:full
   ```

3. **Mở trình duyệt**
   ```
   http://localhost:5173
   ```

**Xong!** ✨

---

**Note:** Frontend sẽ tự động fetch ảnh từ Backend mỗi 5 giây.

Nếu Backend không chạy, Frontend sẽ sử dụng dữ liệu giả lập.
