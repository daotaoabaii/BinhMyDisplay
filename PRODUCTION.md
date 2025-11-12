# ⚙️ Production Configuration Guide

Hướng dẫn cấu hình ứng dụng cho môi trường production.

## 📋 Mục Lục

- [Environment Setup](#environment-setup)
- [Database Optimization](#database-optimization)
- [Performance Tuning](#performance-tuning)
- [Backup & Recovery](#backup--recovery)
- [Monitoring & Alerts](#monitoring--alerts)

---

## 🔐 Environment Setup

### Production .env

**Tạo `.env.production`:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/image_finder?retryWrites=true&w=majority
MONGO_USERNAME=prod_user
MONGO_PASSWORD=secure_password_here

# Server
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Security
CORS_ORIGIN=https://yourdomain.com
API_RATE_LIMIT=100

# Performance
DB_POOL_SIZE=20
DB_TIMEOUT=30000
```

### Secrets Management

**Sử dụng GitHub Secrets (nếu deploy via GitHub Actions):**

```yaml
# .github/workflows/deploy.yml
env:
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
  MONGO_PASSWORD: ${{ secrets.MONGO_PASSWORD }}
```

**Sử dụng Docker Secrets:**

```bash
# Tạo secret
echo "secure_password" | docker secret create mongo_password -

# Sử dụng trong docker-compose.yml
secrets:
  mongo_password:
    external: true
```

---

## 📊 Database Optimization

### MongoDB Connection String Best Practices

```javascript
// ✅ GOOD - With parameters
mongodb+srv://user:password@cluster.mongodb.net/image_finder?
  retryWrites=true&
  w=majority&
  maxPoolSize=50&
  minPoolSize=10&
  maxIdleTimeMS=45000

// ❌ BAD - Default parameters
mongodb://localhost:27017/image_finder
```

### Connection Pooling

**server.js:**

```javascript
const mongooseOptions = {
  maxPoolSize: 20,        // Max connections
  minPoolSize: 10,        // Min connections
  maxIdleTimeMS: 45000,   // Close idle after 45s
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true
};

await mongoose.connect(MONGODB_URI, mongooseOptions);
```

### Index Optimization

**models/Image.ts:**

```javascript
// Các indexes cần thiết
imageSchema.index({ searchQuery: 1 });
imageSchema.index({ createdAt: -1 });
imageSchema.index({ source: 1 });
imageSchema.index({ imageId: 1 }, { unique: true });

// Compound index cho queries thường dùng
imageSchema.index({ source: 1, createdAt: -1 });

// TTL Index
imageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

### Query Optimization

```javascript
// ✅ GOOD - Specific fields
const images = await Image.find()
  .select('imageId imageName imageUrl createdAt')
  .sort({ createdAt: -1 })
  .limit(10)
  .lean();

// ❌ BAD - All fields + heavy computation
const images = await Image.find().sort({ createdAt: -1 }).limit(10);
```

---

## ⚡ Performance Tuning

### Frontend Optimization

**Vite Build Config:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'ES2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    sourcemap: false,  // Disable in production
    chunkSizeWarningLimit: 1000
  }
});
```

**Nginx Caching:**

```nginx
# nginx.conf

# Browser caching
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_comp_level 6;

# Caching headers
add_header X-Cache-Status $upstream_cache_status;
```

### Backend Optimization

**Express Middleware:**

```javascript
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit to 100 requests
  message: 'Too many requests'
});

app.use(limiter);

// Response timeout
app.use((req, res, next) => {
  res.setTimeout(30000);  // 30 seconds
  next();
});
```

### Database Query Performance

```javascript
// Use lean() for read-only queries
const images = await Image.find().lean();

// Pagination
app.get('/api/images', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;
  
  const images = await Image.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  const total = await Image.countDocuments();
  
  res.json({
    data: images,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
});

// Aggregation pipeline
const stats = await Image.aggregate([
  { $group: { _id: '$source', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

---

## 💾 Backup & Recovery

### MongoDB Backup

**Automated Backup Script:**

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/mongodb"
DB_NAME="image_finder"
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mongodump \
  --uri="$MONGO_URI" \
  --db=$DB_NAME \
  --out=$BACKUP_DIR/backup_$TIMESTAMP

# Compress backup
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz $BACKUP_DIR/backup_$TIMESTAMP
rm -rf $BACKUP_DIR/backup_$TIMESTAMP

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $TIMESTAMP"
```

**Schedule với Cron:**

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### Database Restore

```bash
# Restore from backup
mongorestore \
  --uri="mongodb+srv://user:password@cluster.mongodb.net" \
  --archive=backup_20240115_020000.tar.gz \
  --gzip

# Verify
mongosh "mongodb+srv://user:password@cluster.mongodb.net/image_finder"
> db.images.countDocuments()
```

### Docker Volume Backup

```bash
# Backup MongoDB volume
docker run --rm \
  -v app-mongodb_data:/data \
  -v $(pwd):/backup \
  mongo \
  tar czf /backup/mongodb.tar.gz /data

# Restore
docker run --rm \
  -v app-mongodb_data:/data \
  -v $(pwd):/backup \
  mongo \
  tar xzf /backup/mongodb.tar.gz -C /
```

---

## 📈 Monitoring & Alerts

### Health Checks

**Backend Health Endpoint:**

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Advanced metrics
app.get('/metrics', async (req, res) => {
  try {
    const imageCount = await Image.countDocuments();
    const dbSize = await mongoose.connection.db.stats();
    
    res.json({
      images: imageCount,
      database: {
        size: dbSize.dataSize,
        storageSize: dbSize.storageSize
      },
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Logging

**Winston Logger Setup:**

```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usage
logger.info('Application started');
logger.error('Error occurred', error);
```

### Docker Monitoring

```bash
# Real-time stats
docker stats --no-stream

# Container health
docker inspect app-server | grep -A 5 Health

# Log rotation
docker-compose.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Prometheus Metrics (Optional)

```bash
npm install prom-client
```

```javascript
import prometheus from 'prom-client';

// Default metrics
prometheus.collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code']
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

---

## 🚨 Common Issues & Solutions

### Issue: High Memory Usage

```bash
# Check memory
docker stats

# Solution: Add memory limits
docker-compose.yml:
services:
  server:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Issue: Slow Queries

```bash
# Enable query logging
db.setProfilingLevel(1)

# Find slow queries
db.system.profile.find({ millis: { $gt: 1000 } })
```

### Issue: Database Locks

```javascript
// Use transaction if available
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Image.updateOne({ _id }, update, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

---

## 📚 Tài Liệu Liên Quan

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [DOCKER.md](./DOCKER.md)
- [README.md](./README.md)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-checklist/)
