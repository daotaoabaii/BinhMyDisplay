# Railpack Deployment Setup - Complete Guide

## ✅ Setup hoàn tất cho Railpack (Railway)

Project của bạn đã được cấu hình để deploy cả **Frontend (React + Vite)** và **Backend (Node.js Express)** trên Railway using Railpack builder.

## 📋 Những files đã cập nhật:

### 1. **package.json**
```json
"scripts": {
  "build": "vite build",
  "start": "npm run build && npm run server",
  "start:prod": "node server.js"
}
```
- `npm run build` → Build frontend vào `public/` folder
- `npm run server` → Start Express server
- `npm run start:prod` → Chỉ chạy Express (dùng khi frontend đã build)

### 2. **Dockerfile** (Multi-stage build)
```dockerfile
# Stage 1: Build frontend bằng Vite → output: /app/public
# Stage 2: Copy public vào Express server
# CMD: node server.js
```
- Frontend build output → `public/` folder
- Express serve static files từ `public/`
- API routes vẫn hoạt động tại `/api/*`

### 3. **server.js**
```javascript
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
// SPA fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```
- Serve static files từ `public/` folder
- Fallback route để hỗ trợ React Router
- API routes để MongoDB

### 4. **vite.config.ts**
```typescript
build: {
  outDir: 'public',
  emptyOutDir: true,
}
```
- Build output → `public/` folder (thay vì `dist/`)

### 5. **railway.json** (NEW)
```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod"
  }
}
```
- Cấu hình builder cho Railway/Railpack

### 6. **.railwayignore**
Files không cần upload lên Railway

### 7. **.env.example**
Template cho environment variables

## 🚀 Cách Deploy lên Railway:

### Bước 1: Prepare Local (optional)
```powershell
# Test build locally
npm run build

# Test production locally
npm run start:prod
# Truy cập: http://localhost:3000
```

### Bước 2: Push code lên GitHub
```powershell
git add .
git commit -m "Setup Railpack deployment - final"
git push origin main
```

### Bước 3: Connect Railway
1. Vào https://railway.app
2. Login/Signup với GitHub account
3. Click **"New Project"**
4. Chọn **"Deploy from GitHub repo"**
5. Authorize và Select repository **`BinhMyDisplay`**

### Bước 4: Railway tự động detect & deploy
- Railway detect `package.json` → Node.js project
- Tự động chạy:
  1. `npm ci --only=production` (install dependencies)
  2. `npm run build` (build frontend Vite)
  3. `npm run start:prod` (start Express server)

### Bước 5: Set Environment Variables
Vào Railway Dashboard → Project Settings → Variables
```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key
```

### Bước 6: Deploy hoàn tất!
- Railway sẽ auto-deploy khi bạn push code
- Frontend + API chạy cùng port 3000
- Truy cập: `https://your-railway-app.railway.app`

## 📁 Folder Structure:
```
/app
├── server.js              # Express backend
├── models/                # MongoDB schemas
├── package.json
├── package-lock.json
├── public/                # Built frontend từ Vite
│   ├── index.html         # React app entry point
│   ├── assets/
│   └── ...
└── node_modules/          # Production dependencies
```

## 🔧 Available API Routes:
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get image by ID
- `POST /api/images` - Create new image
- `PUT /api/images/:id` - Update image
- `DELETE /api/images/:id` - Delete image
- `GET /health` - Health check endpoint

## ✔️ Verification:

### Local Testing (before deploy):
```powershell
# Terminal 1: Build frontend
npm run build

# Terminal 2: Start server
npm run start:prod

# Then open http://localhost:3000
```

### Check after deployment on Railway:
- Frontend loads: `https://your-app.railway.app`
- API works: `https://your-app.railway.app/api/images`
- Health check: `https://your-app.railway.app/health`

## 🎯 Key Features:
✅ Frontend + Backend deployed together
✅ Auto-scaling on Railway
✅ Zero downtime deployments
✅ Built-in environment variables management
✅ Auto-rebuild on git push
✅ Health checks enabled
✅ MongoDB support
✅ SPA routing support

## ⚠️ Important Notes:

1. **Ensure `package-lock.json` is committed**
   ```powershell
   git add package-lock.json
   git commit -m "Add package-lock.json"
   ```

2. **MongoDB Connection String format:**
   - Local: `mongodb://localhost:27017/db`
   - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority`

3. **Gemini API Key** must be set on Railway dashboard
   - Not stored in code or `.env` file

4. **Build time:**
   - First deploy: ~5-10 minutes (Railpack caches dependencies)
   - Subsequent deploys: ~2-3 minutes

5. **Auto-deployment:**
   - Any push to main branch → Auto-deploy on Railway
   - Can set deployment restrictions in Railway dashboard

## 🆘 Troubleshooting:

### If `public/` folder is empty:
- Check if `npm run build` succeeds locally
- Verify `vite.config.ts` has `outDir: 'public'`

### If API requests fail on Railway:
- Check MongoDB connection string
- Verify IP whitelist on MongoDB Atlas (allow all or Railway IP)
- Check CORS_ORIGIN setting

### Check Railway logs:
- Railway Dashboard → Project → Deployments → View Logs
- Filter by "build" or "runtime" logs

## 📞 Next Steps:

1. ✅ Push code to GitHub
2. ✅ Connect Railway project
3. ✅ Set environment variables
4. ✅ Monitor first deployment in Railway dashboard
5. ✅ Test app: `https://your-app.railway.app`

---

**Bây giờ bạn có một full-stack app deploy ready! 🚀**
