# 🗄️ HƯỚNG DẪN MONGODB & DỮ LIỆU

## 📊 Cấu Trúc Dữ Liệu

Mỗi **document** trong collection `images` có cấu trúc sau:

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "searchQuery": "người đẹp",
  "imageId": "img_001",
  "imageName": "photo.jpg",
  "imageUrl": "https://example.com/photo.jpg",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSk...",
  "mimeType": "image/jpeg",
  "matchScore": 85,
  "matchReason": "Ảnh rất phù hợp với yêu cầu",
  "source": "upload",
  "driveFileId": null,
  "createdAt": 2024-11-12T10:30:00.000Z,
  "updatedAt": 2024-11-12T10:30:00.000Z
}
```

## 🔍 Giải Thích Từng Field

| Field | Type | Bắt Buộc | Mô Tả |
|-------|------|---------|-------|
| `_id` | ObjectId | ✅ | ID duy nhất (MongoDB tự tạo) |
| `searchQuery` | String | ✅ | Nội dung tìm kiếm (ví dụ: "người đẹp") |
| `imageId` | String | ✅ | ID ảnh duy nhất của bạn |
| `imageName` | String | ✅ | Tên tệp (ví dụ: "photo.jpg") |
| `imageUrl` | String | ❌ | URL ảnh (nếu lưu online) |
| `imageBase64` | String | ❌ | Base64 data của ảnh (nếu lưu offline) |
| `mimeType` | String | ✅ | Loại file (image/jpeg, image/png, ...) |
| `matchScore` | Number | ✅ | Điểm số 0-100 |
| `matchReason` | String | ✅ | Lý do điểm số (Tiếng Việt) |
| `source` | String | ✅ | "upload" hoặc "google-drive" |
| `driveFileId` | String | ❌ | ID Google Drive (nếu từ Drive) |
| `createdAt` | Date | ✅ | Thời gian tạo (tự động) |
| `updatedAt` | Date | ✅ | Thời gian cập nhật (tự động) |

## 💾 Cách Lưu Ảnh

### Cách 1: Lưu Base64 (Khuyến Khích)

```javascript
// Ảnh nhỏ, không phụ thuộc server
{
  imageName: "photo.jpg",
  imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  mimeType: "image/jpeg",
  matchScore: 85,
  matchReason: "Ảnh sắc nét",
  // ...
}
```

**Ưu điểm:** Ảnh lưu trực tiếp trong DB, không cần server file  
**Nhược điểm:** DB size lớn, performance chậm với ảnh lớn

### Cách 2: Lưu URL (Tối Ưu)

```javascript
// Ảnh lưu trên server/cloud
{
  imageName: "photo.jpg",
  imageUrl: "https://example.com/uploads/photo.jpg",
  mimeType: "image/jpeg",
  matchScore: 85,
  matchReason: "Ảnh sắc nét",
  // ...
}
```

**Ưu điểm:** DB nhỏ, nhanh, có thể lưu ảnh lớn  
**Nhược điểm:** Phụ thuộc URL tồn tại

### Cách 3: Lưu Cả Hai

```javascript
// An toàn nhất
{
  imageName: "photo.jpg",
  imageUrl: "https://example.com/uploads/photo.jpg",
  imageBase64: "data:image/jpeg;base64,...",  // Thumbnail
  // ...
}
```

## 🔄 Cách Thêm Ảnh Vào MongoDB

### Cách 1: Dùng MongoDB Shell

```bash
# Kết nối
mongo

# Chọn database
use ai-image-finder

# Thêm 1 ảnh
db.images.insertOne({
  searchQuery: "người đẹp",
  imageId: "img_001",
  imageName: "photo.jpg",
  imageUrl: "https://example.com/photo.jpg",
  mimeType: "image/jpeg",
  matchScore: 85,
  matchReason: "Ảnh rất phù hợp",
  source: "upload",
  createdAt: new Date(),
  updatedAt: new Date()
})

# Xem kết quả
db.images.find().pretty()
```

### Cách 2: Dùng MongoDB Compass (GUI)

1. Tải: https://www.mongodb.com/products/tools/compass
2. Kết nối MongoDB
3. Chọn database `ai-image-finder`
4. Chọn collection `images`
5. Click `Insert Document`
6. Nhập data theo schema trên

### Cách 3: Programmatically (Node.js)

```javascript
// API endpoint (Express)
app.post('/api/images', async (req, res) => {
  const { searchQuery, imageName, imageUrl, matchScore, matchReason } = req.body;
  
  const newImage = await Image.create({
    searchQuery,
    imageId: `img_${Date.now()}`,
    imageName,
    imageUrl,
    mimeType: 'image/jpeg',
    matchScore,
    matchReason,
    source: 'upload',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  res.json(newImage);
});
```

## 📂 Quản Lý Ảnh

### Xem Tất Cả Ảnh

```bash
mongo
use ai-image-finder
db.images.find().pretty()
```

### Xem Ảnh Mới Nhất

```bash
db.images.find().sort({ createdAt: -1 }).limit(20)
```

### Xem Ảnh Theo Score

```bash
db.images.find().sort({ matchScore: -1 }).limit(10)
```

### Đếm Ảnh

```bash
db.images.countDocuments()
```

### Xóa Ảnh

```bash
# Xóa 1 ảnh
db.images.deleteOne({ imageId: "img_001" })

# Xóa nhiều ảnh
db.images.deleteMany({ source: "upload" })

# Xóa tất cả (cẩn thận!)
db.images.deleteMany({})
```

### Cập Nhật Ảnh

```bash
db.images.updateOne(
  { imageId: "img_001" },
  { $set: { matchScore: 95, matchReason: "Cập nhật" } }
)
```

## 🗂️ Collections Trong Database

Mặc định, MongoDB sẽ có 1 collection:

```
ai-image-finder (Database)
├── images (Collection)
│   └── Document 1, 2, 3, ...
```

## 🔑 Indexes

MongoDB sẽ tự tạo các indexes sau (từ `Image.ts`):

```javascript
imageSchema.index({ createdAt: 1 });  // Sắp xếp theo ngày
imageSchema.index({ searchQuery: 1 }); // Tìm kiếm
imageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL (30 ngày)
```

## 📊 Ví Dụ Dữ Liệu

### Ảnh Từ Google Drive

```javascript
{
  searchQuery: "phong cảnh",
  imageId: "drive_img_001",
  imageName: "landscape.jpg",
  imageUrl: "https://drive.google.com/uc?id=1A2B3C...",
  mimeType: "image/jpeg",
  matchScore: 92,
  matchReason: "Phong cảnh tự nhiên đẹp",
  source: "google-drive",
  driveFileId: "1A2B3C4D5E6F7G8H9",
  createdAt: 2024-11-12T10:00:00Z
}
```

### Ảnh Từ Upload

```javascript
{
  searchQuery: "người",
  imageId: "img_001",
  imageName: "profile.jpg",
  imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  mimeType: "image/jpeg",
  matchScore: 88,
  matchReason: "Ảnh chân dung đẹp",
  source: "upload",
  createdAt: 2024-11-12T11:00:00Z
}
```

## ⚙️ Cấu Hình TTL

Ảnh sẽ tự động xóa sau **30 ngày**:

```javascript
// Trong Image.ts
imageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
// 2592000 giây = 30 ngày
```

Nếu muốn thay đổi:
- **7 ngày**: `604800`
- **14 ngày**: `1209600`
- **30 ngày**: `2592000` (mặc định)
- **60 ngày**: `5184000`
- **90 ngày**: `7776000`

Hoặc bỏ TTL hoàn toàn:
```javascript
// Xóa dòng này trong Image.ts
// imageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

## 🔒 Backup & Restore

### Backup Database

```bash
# Backup tất cả
mongodump --db ai-image-finder --out ./backup

# Restore
mongorestore --db ai-image-finder ./backup/ai-image-finder
```

## 📈 Performance Tips

1. **Index Searchable Fields**
   ```javascript
   db.images.createIndex({ searchQuery: 1 })
   db.images.createIndex({ source: 1 })
   ```

2. **Lean Queries** (Trong mongoService.ts)
   ```javascript
   const images = await Image.find().lean()
   // .lean() không trả về Mongoose documents
   // Performance tốt hơn 2x
   ```

3. **Limit Results**
   ```javascript
   // Thay vì load tất cả
   const images = await Image.find().limit(20)
   ```

4. **Pagination**
   ```javascript
   const page = 1
   const limit = 10
   const skip = (page - 1) * limit
   
   const images = await Image.find().skip(skip).limit(limit)
   ```

## 📝 Schema Validation

Nếu muốn MongoDB tự kiểm tra dữ liệu:

```javascript
// Thêm vào Image.ts
imageSchema.pre('save', function(next) {
  if (this.matchScore < 0 || this.matchScore > 100) {
    throw new Error('matchScore phải từ 0-100')
  }
  if (!['upload', 'google-drive'].includes(this.source)) {
    throw new Error('source không hợp lệ')
  }
  next()
})
```

## 🆘 Lỗi Thường Gặp

### Lỗi 1: Collection `images` không tồn tại
```
Giải pháp: MongoDB tự tạo khi insertMany lần đầu
hoặc dùng db.createCollection('images')
```

### Lỗi 2: _id bị trùng
```
Giải pháp: _id là duy nhất, MongoDB tự tạo ObjectId
không bao giờ trùng
```

### Lỗi 3: Dữ liệu không valid
```
Giải pháp: Kiểm tra schema match với data
không được thiếu fields bắt buộc
```

---

**✅ Bây giờ bạn hiểu MongoDB!** 🎉
