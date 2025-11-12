@echo off
REM Production Start Script for Windows
REM Usage: start-production.bat

setlocal enabledelayedexpansion

echo ==========================================
echo   🚀 Starting Production Environment
echo ==========================================

REM Check if .env exists
if not exist .env (
    echo ✗ .env file not found!
    echo   Please create .env file first:
    echo   copy .env.example .env
    exit /b 1
)

echo ✓ .env file found

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker not installed
    exit /b 1
)

echo ✓ Docker is installed

REM Check Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker Compose not installed
    exit /b 1
)

echo ✓ Docker Compose is installed

echo.
echo ==========================================
echo   🔨 Building Images
echo ==========================================
echo.

docker-compose build

echo.
echo ==========================================
echo   ✨ Starting Services
echo ==========================================
echo.

docker-compose up -d

echo.
echo ==========================================
echo   🔍 Checking Services Status
echo ==========================================
echo.

timeout /t 5 /nobreak

echo Checking MongoDB...
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is not responding
)

echo.
echo Checking Backend Server...
docker-compose exec -T server curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend server is healthy
) else (
    echo ✗ Backend server is not responding
)

echo.
echo Checking Frontend...
docker-compose ps | find "app-frontend" | find "Up" >nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is not running
)

echo.
echo ==========================================
echo   📊 Services Status
echo ==========================================
echo.

docker-compose ps

echo.
echo ==========================================
echo   📱 Application URLs
echo ==========================================
echo.

echo Frontend:  http://localhost:3001
echo Backend:   http://localhost:3000
echo API:       http://localhost:3000/api/images
echo Health:    http://localhost:3000/health
echo.

echo ==========================================
echo   📝 Useful Commands
echo ==========================================
echo.

echo View logs:
echo   docker-compose logs -f
echo.
echo View backend logs:
echo   docker-compose logs -f server
echo.
echo Stop services:
echo   docker-compose stop
echo.
echo Restart services:
echo   docker-compose restart
echo.
echo Remove everything:
echo   docker-compose down
echo.
echo ==========================================
echo ✓ Production environment is ready!
echo ==========================================
echo.

exit /b 0
