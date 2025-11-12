# Hướng Dẫn Thay Đổi - Từ Tìm Kiếm Ảnh Sang Hiển Thị Ảnh

## Tóm Tắt Thay Đổi

Ứng dụng đã được **chuyển đổi hoàn toàn** từ chức năng tìm kiếm ảnh sang chức năng hiển thị ảnh từ MongoDB.

### Các Tính Năng Bị Loại Bỏ
- ❌ **Tìm kiếm ảnh**: Loại bỏ SearchBar, logic tìm kiếm và sử dụng Gemini AI
- ❌ **Tải lên ảnh**: Loại bỏ ImageUploader
- ❌ **Kết nối Google Drive**: Loại bỏ DriveImageLoader
- ❌ **Nhận diện giọng nói**: Loại bỏ useSpeechRecognition hook

### Các Tính Năng Mới
- ✅ **Kết nối MongoDB**: Tự động kết nối và lấy dữ liệu
- ✅ **Hiển thị ảnh tự động**: Lấy 20 ảnh mới nhất từ MongoDB
- ✅ **Làm tươi dữ liệu**: Tự động cập nhật ảnh mới mỗi 5 giây
- ✅ **Xem ảnh toàn màn hình**: Giữ lại chức năng này
- ✅ **Hiển thị thông tin**: Hiển thị điểm số, lý do và nguồn ảnh

## Các File Được Thay Đổi

### 1. **App.tsx** (Thay đổi chính)
```typescript
// Trước: Có SearchBar, ImageUploader, DriveImageLoader, rateBatchImageMatch
// Sau: Chỉ có ResultDisplay, FullscreenViewer, getLatestImages

// Xóa:
- import SearchBar, ImageUploader, DriveImageLoader
- import rateBatchImageMatch, useSpeechRecognition
- State: query, bestMatch, isListening

// Thêm:
- import getLatestImages
- useEffect để fetch ảnh từ MongoDB mỗi 5 giây
```

### 2. **types.ts** (Mở rộng)
```typescript
// Thêm interface mới:
interface MongoImage {
  _id?: string;
  searchQuery: string;
  imageId: string;
  imageName: string;
  imageUrl?: string;
  imageBase64?: string;
  mimeType: string;
  matchScore: number;
  matchReason: string;
  source: 'google-drive' | 'upload';
  driveFileId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cập nhật MatchResult:
// Thay ImageFile | MongoImage thay vì chỉ ImageFile
```

### 3. **ResultDisplay.tsx** (Thiết kế lại)
```typescript
// Trước: Hiển thị 1 kết quả tìm kiếm tốt nhất
// Sau: Hiển thị lưới ảnh (grid layout)

// Thay đổi Props:
// Trước: result: MatchResult, imageCount: number, onImageClick()
// Sau: images: MongoImage[], onImageClick(image)
```

### 4. **FullscreenViewer.tsx** (Cập nhật)
```typescript
// Hỗ trợ cả ImageFile và MongoImage
// Xử lý imageBase64 hoặc imageUrl từ MongoDB
```

### 5. **models/Image.ts** (Tệp mới)
```typescript
// Schema Mongoose để định nghĩa cấu trúc dữ liệu MongoDB
// Có TTL index tự động xóa dữ liệu sau 30 ngày
```

### 6. **services/mongoService.ts** (Tệp mới)
```typescript
// connectMongoDB(): Kết nối MongoDB
// getLatestImages(limit): Lấy N ảnh mới nhất
// getImageById(id): Lấy ảnh theo ID
// saveImage(data): Lưu ảnh mới
```

### 7. **package.json** (Cập nhật)
```json
// Thêm dependency: mongoose ^7.5.0
```

## Cài Đặt & Sử Dụng

### 1. Cài Đặt Mongoose
```bash
npm install mongoose@^7.5.0
```

### 2. Cấu Hình Biến Môi Trường
Thêm vào `.env`:
```
MONGODB_URI=mongodb://username:password@localhost:27017/ai-image-finder
```

Hoặc mặc định:
```
mongodb://localhost:27017/ai-image-finder
```

### 3. Chạy Ứng Dụng
```bash
npm run dev
```

### 4. Tự Động Fetch Ảnh
- Ứng dụng sẽ **tự động** fetch ảnh mới nhất khi khởi động
- Cập nhật **mỗi 5 giây**
- Hiển thị tối đa **20 ảnh** mới nhất

## Cấu Trúc Dữ Liệu MongoDB

```javascript
{
  _id: ObjectId,
  searchQuery: "ví dụ: người đẹp",
  imageId: "id_123",
  imageName: "photo.jpg",
  imageUrl: "https://...",
  imageBase64: "data:image/jpeg;base64,...",
  mimeType: "image/jpeg",
  matchScore: 85,        // 0-100
  matchReason: "Hình ảnh rất phù hợp",
  source: "upload",      // "google-drive" hoặc "upload"
  driveFileId: "id_456",
  createdAt: 2024-11-12T10:30:00Z,
  updatedAt: 2024-11-12T10:30:00Z
}
```

## Tính Năng Sẽ Loại Bỏ

Các file sau có thể xóa nếu không còn sử dụng:
- `components/SearchBar.tsx`
- `components/ImageUploader.tsx`
- `components/DriveImageLoader.tsx`
- `hooks/useSpeechRecognition.ts`
- `services/geminiService.ts`
- `services/driveService.ts`
- `services/cacheService.ts`

## Lỗi Có Thể Gặp & Cách Khắc Phục

### Lỗi 1: Cannot find module 'mongoose'
```bash
npm install mongoose
```

### Lỗi 2: MongoDB connection failed
- Kiểm tra MONGODB_URI trong `.env`
- Đảm bảo MongoDB server đang chạy
- Kiểm tra quyền truy cập

### Lỗi 3: Ảnh không hiển thị
- Kiểm tra imageBase64 hoặc imageUrl trong MongoDB
- Kiểm tra định dạng Base64

## Thay Đổi Giao Diện

### Trước (3 cột)
```
[Loader] [Upload]
[Search Bar]
[Result - Best Match]
```

### Sau (1 cột - Full width)
```
[Grid của ảnh - 4 cột trên desktop, 1 cột trên mobile]
```

## Hiệu Suất & Cải Tiến

- **Giảm tải API**: Không sử dụng Gemini AI nữa
- **Tự động cập nhật**: Refresh mỗi 5 giây (có thể tùy chỉnh)
- **Cẩp thị tốt hơn**: Lưới ảnh dễ xem hơn
- **Responsive**: Tự động thích ứng với kích thước màn hình

## Tiếp Theo

Nếu muốn thêm chức năng:
1. **Phân trang**: Thêm pagination trong ResultDisplay
2. **Tìm kiếm**: Thêm filter theo `searchQuery` hoặc `source`
3. **Sắp xếp**: Sắp xếp theo ngày, điểm số, v.v.
4. **Xóa ảnh**: Thêm nút xóa với API DELETE
5. **Tải lên ảnh**: Thêm form để save ảnh vào MongoDB
