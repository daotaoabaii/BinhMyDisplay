# 🎯 Deployment Quick Reference

Bảng tóm tắt nhanh các lệnh deployment.

## 📋 Cheat Sheet

### Docker Deployment

```bash
# Setup
cp .env.example .env         # Copy environment
nano .env                    # Edit variables

# Build & Run
docker-compose build                    # Build images
docker-compose up -d                    # Run in background
docker-compose ps                       # Check status

# Logs
docker-compose logs -f                  # Follow all logs
docker-compose logs -f server           # Follow backend
docker-compose logs -f frontend         # Follow frontend

# Stop & Clean
docker-compose stop                     # Stop containers
docker-compose down                     # Remove containers
docker-compose down -v                  # Remove + volumes

# Rebuild
docker-compose build --no-cache         # Rebuild from scratch
docker-compose up -d --build            # Build & run
```

### Local Production Deployment

```bash
# Setup
cp .env.example .env
npm install
npm run build                           # Build frontend

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run preview

# Or run together
npm run start:full                      # Concurrent mode
```

### PM2 Management

```bash
# Setup
npm install -g pm2

# Start
pm2 start ecosystem.config.js           # Start all services
pm2 start server.js --name backend      # Start backend only

# Monitor
pm2 status                              # Show status
pm2 logs                                # Show logs
pm2 logs backend                        # Logs for backend
pm2 monit                               # Real-time monitoring

# Manage
pm2 restart all                         # Restart services
pm2 stop all                            # Stop services
pm2 delete all                          # Delete services

# Startup
pm2 startup                             # Enable on reboot
pm2 save                                # Save config
```

## 🌐 URLs After Deployment

| Service | Local | Production |
|---------|-------|------------|
| Frontend | http://localhost:3001 | https://yourdomain.com |
| Backend API | http://localhost:3000/api | https://yourdomain.com/api |
| Health Check | http://localhost:3000/health | https://yourdomain.com/health |
| MongoDB | localhost:27017 | mongodb+srv://... |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (DO NOT commit!) |
| `.env.example` | Template (safe to commit) |
| `docker-compose.yml` | Docker multi-container config |
| `Dockerfile` | Backend image definition |
| `Dockerfile.frontend` | Frontend image definition |
| `nginx.conf` | Nginx web server config |
| `server.js` | Express backend server |
| `package.json` | Dependencies & scripts |

## 🔧 Common Tasks

### Restart Everything

```bash
# Docker
docker-compose restart

# PM2
pm2 restart all

# Manual
# Kill process + restart
```

### View Logs

```bash
# Docker - last 100 lines
docker-compose logs --tail=100

# Docker - follow
docker-compose logs -f server

# PM2
pm2 logs backend --lines=100

# System logs
tail -f /var/log/app.log
```

### Backup Database

```bash
# Export to file
mongodump --uri="mongodb://..." --out=backup/

# Backup script
./backup.sh

# Compress
tar -czf backup.tar.gz backup/
```

### Database Commands

```bash
# Connect
mongosh "mongodb+srv://user:password@cluster.mongodb.net/image_finder"

# Check collections
show collections
db.images.countDocuments()

# Find latest images
db.images.find().sort({ createdAt: -1 }).limit(5)

# Delete old data
db.images.deleteMany({ createdAt: { $lt: new Date("2024-01-01") } })
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Frontend
curl http://localhost:3001

# Database
mongosh "mongodb+srv://..." --eval "db.adminCommand('ping')"
```

### Resource Usage

```bash
# Docker stats
docker stats

# System resources
top
df -h              # Disk space
free -h             # Memory
```

## 🛡️ Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port already in use | `lsof -i :3000` or change port in `.env` |
| Docker won't start | `docker-compose down` then `up` again |
| MongoDB connection fails | Check MONGODB_URI in `.env` |
| Frontend can't reach backend | Check if backend is running, verify API URL |
| Out of disk space | `docker system prune -a` |
| Memory issues | Increase container limits in `docker-compose.yml` |

## 🔐 Security Checklist

- [ ] `.env` file not committed to git
- [ ] Use HTTPS in production
- [ ] Strong MongoDB password
- [ ] CORS configured for your domain
- [ ] Rate limiting enabled
- [ ] Firewalls configured
- [ ] Regular backups running
- [ ] Logs being monitored

## 📱 Deploy to Cloud

### Heroku
```bash
heroku login
heroku create app-name
heroku config:set MONGODB_URI="..."
git push heroku main
```

### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Railway
```bash
npm i -g @railway/cli
railway login
railway up
```

## 🤝 Support

- Logs: `docker-compose logs`
- Health: `curl localhost:3000/health`
- Docs: See [DEPLOYMENT.md](./DEPLOYMENT.md), [DOCKER.md](./DOCKER.md), [PRODUCTION.md](./PRODUCTION.md)
