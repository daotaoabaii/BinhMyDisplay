# Trình Hiển Thị Ảnh Thông Minh

Ứng dụng hiển thị ảnh từ MongoDB với giao diện thân thiện người dùng.

## ✨ Tính Năng

- 📸 **Hiển thị ảnh tự động** từ MongoDB
- 🔄 **Cập nhật real-time** mỗi 5 giây
- 🖼️ **Xem ảnh toàn màn hình** với trải nghiệm mượt mà
- 📱 **Responsive** trên desktop, tablet và mobile
- ⚡ **Hiệu suất cao** không sử dụng API ngoài

## 🛠️ Yêu Cầu Hệ Thống

- **Node.js**: v18+ 
- **npm** hoặc **yarn**
- **MongoDB**: Local hoặc Cloud (Atlas)

## 📦 Cài Đặt

### 1. Clone Repository
```bash
git clone <repository-url>
cd ai-image-finder
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Biến Môi Trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật `MONGODB_URI` trong `.env`:
```
MONGODB_URI=mongodb://localhost:27017/ai-image-finder
```

### 4. Khởi Động MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

**Hoặc sử dụng MongoDB Atlas (Cloud):**
1. Truy cập https://www.mongodb.com/cloud/atlas
2. Tạo tài khoản và cluster
3. Sao chép connection string
4. Cập nhật `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-image-finder?retryWrites=true&w=majority
```

## 🚀 Chạy Ứng Dụng

### Development
```bash
npm run dev
```
Truy cập http://localhost:5173

### Build for Production
```bash
npm run build
npm run preview
```

## 📊 Cấu Trúc Dữ Liệu MongoDB

Mỗi document trong collection `images` có cấu trúc:

```javascript
{
  _id: ObjectId,
  searchQuery: "description",    // Nội dung tìm kiếm
  imageId: "unique_id",          // ID ảnh duy nhất
  imageName: "photo.jpg",        // Tên tệp
  imageUrl: "https://...",       // URL ảnh (tuỳ chọn)
  imageBase64: "data:image/...", // Base64 data (tuỳ chọn)
  mimeType: "image/jpeg",        // Loại MIME
  matchScore: 85,                // Điểm 0-100
  matchReason: "Phù hợp",        // Lý do điểm số
  source: "upload",              // "google-drive" hoặc "upload"
  driveFileId: "id",             // ID Drive (nếu từ Google Drive)
  createdAt: Date,               // Thời gian tạo
  updatedAt: Date                // Thời gian cập nhật
}
```

## 🗂️ Cấu Trúc Project

```
ai-drive-image-finder/
├── src/
│   ├── App.tsx                 # Component chính
│   ├── index.tsx               # Entry point
│   ├── types.ts                # TypeScript interfaces
│   ├── components/
│   │   ├── ResultDisplay.tsx   # Hiển thị grid ảnh
│   │   ├── FullscreenViewer.tsx # Xem toàn màn hình
│   │   └── ...
│   ├── services/
│   │   ├── mongoService.ts     # Kết nối MongoDB
│   │   └── ...
│   ├── models/
│   │   └── Image.ts            # Schema Mongoose
│   └── hooks/
│       └── ...
├── .env.example                # Template biến môi trường
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
└── README.md                   # File này
```

## 🔧 API Endpoints (Server-side)

### Lấy ảnh mới nhất
```
GET /api/images?limit=20
```

### Lấy ảnh theo ID
```
GET /api/images/:id
```

### Tạo ảnh mới
```
POST /api/images
Body: { searchQuery, imageId, imageName, ... }
```

### Xóa ảnh
```
DELETE /api/images/:id
```

## 📝 Thay Đổi Gần Đây

**v2.0.0** - Chuyển đổi sang MongoDB
- ✨ Loại bỏ SearchBar
- ✨ Loại bỏ ImageUploader
- ✨ Loại bỏ Gemini AI
- ✨ Thêm MongoDB integration
- ✨ Tự động fetch ảnh mỗi 5 giây
- ✨ Grid layout cho ảnh

## 🤝 Đóng Góp

Nếu có vấn đề hoặc đề xuất, vui lòng tạo issue hoặc pull request.

## 📄 Giấy Phép

MIT License

## 📞 Hỗ Trợ

Liên hệ: training@abaii.vn
Viện: Công nghệ Blockchain và Trí tuệ nhân tạo (ABAII)
