import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  // Thông tin tìm kiếm
  searchQuery: {
    type: String,
    required: true,
    index: true,
  },
  
  // Thông tin ảnh
  imageId: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  imageBase64: {
    type: String,
  },
  mimeType: {
    type: String,
    default: 'image/jpeg',
  },
  
  // Kết quả AI
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  matchReason: {
    type: String,
    required: true,
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['google-drive', 'upload'],
    default: 'upload',
  },
  driveFileId: {
    type: String,
  },
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL Index - Tự động xóa dữ liệu sau 30 ngày (tùy chỉnh theo nhu cầu)
imageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Image = mongoose.model('Image', imageSchema);
