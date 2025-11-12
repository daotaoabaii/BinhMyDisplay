# 🚀 Railpack Deployment - Quick Start

## ✅ Setup Status: COMPLETE

Tất cả configuration cho Railpack đã được setup xong. Backend + Frontend chạy trên cùng một port (3000).

---

## 📋 Files cập nhật:

| File | Mục đích |
|------|---------|
| `package.json` | Scripts tối ưu cho Railpack |
| `Dockerfile` | Multi-stage build (Frontend + Backend) |
| `server.js` | Serve static files + API routes |
| `vite.config.ts` | Build output → `public/` folder |
| `railway.json` | Railpack configuration |
| `.railwayignore` | Files loại trừ khỏi deployment |
| `.env.example` | Environment variables template |

---

## 🎯 Quá trình Deploy:

### **Step 1: Verify local setup** ✅ (DONE)
```powershell
npm run build      # Frontend built to public/
npm run start:prod # Server running on port 3000
```

### **Step 2: Push to GitHub** ✅ (DONE)
```powershell
git push origin main
```

### **Step 3: Deploy on Railway** (NEXT)

#### Vào Railway Dashboard:
1. Đăng nhập https://railway.app
2. Click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Kết nối **`BinhMyDisplay`** repository
5. Railway tự động:
   - Detect Node.js project
   - Build frontend (Vite)
   - Install dependencies
   - Start server

#### Set Environment Variables:
```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Deploy tự động khi push code:
```powershell
git push origin main  # Railway sẽ auto-deploy
```

---

## 📁 Production Structure:

```
/app (Railway)
├── server.js
├── models/
├── package.json
├── public/              ← Frontend built files
│   ├── index.html
│   ├── assets/
│   └── ...
└── node_modules/        ← Production deps only
```

---

## 🌐 URLs sau deploy:

| Endpoint | URL |
|----------|-----|
| Frontend | `https://your-app.railway.app` |
| API | `https://your-app.railway.app/api/*` |
| Health Check | `https://your-app.railway.app/health` |

---

## ✔️ Test Endpoints:

### Health Check:
```powershell
curl https://your-app.railway.app/health
```

### Get Images API:
```powershell
curl https://your-app.railway.app/api/images
```

### Create Image:
```powershell
curl -X POST https://your-app.railway.app/api/images `
  -H "Content-Type: application/json" `
  -d '{"searchQuery":"test","imageId":"123"}'
```

---

## 📊 Monitoring:

### Railway Dashboard:
- Logs: Project → Deployments → View Logs
- Metrics: CPU, Memory, Network
- Rollback: Previous deployments available

### Check Logs:
```
Railway Dashboard → Project → Logs
Filter: "Backend", "Build", "Error"
```

---

## ⚙️ Production Scripts:

| Script | Mục đích |
|--------|---------|
| `npm run build` | Build frontend |
| `npm run start:prod` | Start Express server only |
| `npm start` | Build + Start (first time) |
| `npm run dev:full` | Dev mode (both frontend + backend) |

---

## 🔒 Security Checklist:

- ✅ Environment variables set on Railway (not in code)
- ✅ MongoDB connection string secured
- ✅ CORS configured for production
- ✅ Health checks enabled
- ✅ No .env file in Git
- ✅ package-lock.json committed

---

## 🆘 Troubleshooting:

### Public folder empty:
```powershell
# Verify locally
npm run build
# Should create public/index.html and public/assets/
```

### MongoDB connection fails on Railway:
- Check connection string format
- Allow Railway IP in MongoDB Atlas
- Verify credentials in environment variables

### Build fails on Railway:
- Check Railway Logs
- Verify package.json scripts
- Ensure package-lock.json exists

### Frontend not loading:
- Check public/index.html exists
- Verify SPA fallback route in server.js
- Check browser console for errors

---

## 📞 Next Steps:

1. Go to https://railway.app
2. Connect GitHub account
3. Create new project from `BinhMyDisplay` repo
4. Set environment variables
5. Monitor first deployment
6. Test: https://your-app.railway.app

---

## 🎉 Summary:

✅ **Frontend + Backend**: Deployed cùng một container
✅ **Auto-scaling**: Railway handles load
✅ **Zero downtime**: Auto-deployments
✅ **Environment**: Secure variable management
✅ **Monitoring**: Built-in logging & metrics

**Ready to deploy! 🚀**