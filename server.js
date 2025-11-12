// Backend server for MongoDB connection
// Run this server separately: node server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (built by Vite)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-image-finder';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Image Schema
const imageSchema = new mongoose.Schema({
  searchQuery: { type: String, required: true, index: true },
  imageId: { type: String, required: true },
  imageName: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  imageBase64: String,
  mimeType: { type: String, default: 'image/jpeg' },
  matchScore: { type: Number, required: true, min: 0, max: 100 },
  matchReason: { type: String, required: true },
  source: { type: String, enum: ['google-drive', 'upload'], default: 'upload' },
  driveFileId: String,
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

// TTL Index - auto delete after 30 days
imageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Image = mongoose.model('Image', imageSchema);

// Routes

// GET /api/images - Get latest images
app.get('/api/images', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const images = await Image.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/images/:id - Get image by ID
app.get('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).lean();
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/images - Create new image
app.post('/api/images', async (req, res) => {
  try {
    const newImage = new Image(req.body);
    await newImage.save();
    
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/images/:id - Update image
app.put('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/images/:id - Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Fallback route for SPA - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`\n✓ Backend server running on http://localhost:${PORT}`);
  console.log(`✓ API endpoint: http://localhost:${PORT}/api`);
  console.log(`✓ Frontend served from: http://localhost:${PORT}`);
  console.log(`✓ MongoDB: ${MONGODB_URI}\n`);
});
