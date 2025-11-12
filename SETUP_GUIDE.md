# 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY

## Bước 1: Cài Đặt Dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả dependencies bao gồm:
- `mongoose` - MongoDB ODM (mới thêm)
- `react`, `react-dom` - React framework
- `vite` - Build tool
- Các dependencies khác

## Bước 2: Cấu Hình MongoDB

### Tùy Chọn A: MongoDB Local

**Windows:**
1. Tải MongoDB Community: https://www.mongodb.com/try/download/community
2. Chạy installer
3. Khởi động service:
```bash
mongod
```

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Tùy Chọn B: MongoDB Atlas (Cloud)

1. Truy cập: https://www.mongodb.com/cloud/atlas
2. Đăng ký tài khoản miễn phí
3. Tạo cluster mới
4. Lấy connection string
5. Cập nhật `.env` file

## Bước 3: Tạo File `.env`

Từ `.env.example`, tạo `.env`:

```bash
cp .env.example .env
```

Hoặc tạo thủ công:

**`.env`:**
```
MONGODB_URI=mongodb://localhost:27017/ai-image-finder
```

**Hoặc với MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-image-finder?retryWrites=true&w=majority
```

## Bước 4: Chạy Ứng Dụng

### Development Mode:
```bash
npm run dev
```

Output:
```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Mở trình duyệt: http://localhost:5173

### Production Build:
```bash
npm run build
npm run preview
```

## 🧪 Kiểm Tra Kết Nối

Để xác nhận MongoDB kết nối thành công:

1. Mở DevTools (F12) trong trình duyệt
2. Mở tab Console
3. Kiểm tra không có lỗi liên quan tới MongoDB
4. Ảnh phải hiển thị trên trang

## ⚠️ Lỗi Thường Gặp & Cách Khắc Phục

### Lỗi 1: "Cannot find module 'mongoose'"
```
Giải pháp:
npm install mongoose
```

### Lỗi 2: "connect ECONNREFUSED 127.0.0.1:27017"
```
Giải pháp:
1. Kiểm tra MongoDB đang chạy:
   - Windows: Task Manager → mongod process
   - Mac/Linux: brew services list hoặc ps aux | grep mongod

2. Khởi động MongoDB:
   mongod (Windows)
   brew services start mongodb-community (Mac)
   sudo systemctl start mongodb (Linux)

3. Nếu vẫn lỗi, kiểm tra MONGODB_URI trong .env
```

### Lỗi 3: "ENOENT: no such file or directory, open '.env'"
```
Giải pháp:
Tạo file .env:
cp .env.example .env

Hoặc tạo thủ công với nội dung:
MONGODB_URI=mongodb://localhost:27017/ai-image-finder
```

### Lỗi 4: "Invalid MongoDB URI"
```
Giải pháp:
Kiểm tra MONGODB_URI:
- Đúng cú pháp: mongodb://host:port/database
- Đúng host/port
- Nếu dùng Atlas, kiểm tra username/password
```

### Lỗi 5: "Ảnh không hiển thị"
```
Giải pháp:
1. Kiểm tra MongoDB có dữ liệu:
   - Dùng MongoDB Compass hoặc shell
   - Chạy: db.images.find()

2. Tạo dữ liệu mẫu:
   node scripts/seedDB.js

3. Kiểm tra imageBase64 hoặc imageUrl có giá trị
```

## 📊 Kiểm Tra Dữ Liệu MongoDB

### Sử dụng MongoDB Compass (GUI)
1. Tải: https://www.mongodb.com/products/tools/compass
2. Kết nối tới database
3. Xem collection `images`

### Sử dụng MongoDB Shell
```bash
# Kết nối
mongo

# Chuyển database
use ai-image-finder

# Xem tất cả ảnh
db.images.find().pretty()

# Đếm ảnh
db.images.countDocuments()

# Xóa tất cả (cẩn thận!)
db.images.deleteMany({})
```

## 🔧 Troubleshooting

### Check 1: Node.js version
```bash
node --version
# Cần v18+
```

### Check 2: npm version
```bash
npm --version
```

### Check 3: MongoDB status
```bash
# Windows: Check Task Manager
# Mac: brew services list
# Linux: sudo systemctl status mongodb
```

### Check 4: Ports
```bash
# Port 5173 (Vite dev server)
# Port 27017 (MongoDB)

# Kiểm tra port còn trống
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux
```

## 📈 Tiếp Theo Sau Khi Cài Đặt

1. ✅ Ứng dụng chạy thành công
2. ✅ Ảnh hiển thị từ MongoDB
3. 📝 Tùy chỉnh giao diện (tailwind)
4. 📝 Thêm tính năng mới (filter, search, delete)
5. 📝 Deploy lên production

## 🚀 Deploy (Tuỳ Chọn)

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### AWS/Azure/GCP
Xem tài liệu của từng platform

---

**💡 Tips:** Nếu gặp vấn đề, hãy:
1. Đọc console error message
2. Kiểm tra `.env` file
3. Kiểm tra MongoDB connection
4. Xem MIGRATION_GUIDE.md
5. Xem README_NEW.md

**✅ Bây giờ đã sẵn sàng!** 🎉
