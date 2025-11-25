# Quick Start Guide - Start Both Servers

## Option 1: Manual Start (Recommended)

### Terminal 1 - Backend Server

1. Open PowerShell or Command Prompt
2. Navigate to backend:
   ```powershell
   cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main\backend"
   ```
3. Check if .env file exists, if not create it:
   ```powershell
   # Create .env file with these contents:
   # JWT_SECRET=your_super_secret_jwt_key_12345
   # REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_12345
   # PORT=5000
   # NODE_ENV=development
   ```
4. Install dependencies (if not done):
   ```powershell
   npm install
   ```
5. Start backend:
   ```powershell
   npm run dev
   ```
   You should see: "Server running on port 5000"

### Terminal 2 - Frontend Server

1. Open a NEW PowerShell or Command Prompt window
2. Navigate to frontend:
   ```powershell
   cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main\frontend"
   ```
3. Install dependencies (if not done):
   ```powershell
   npm install
   ```
4. Start frontend:
   ```powershell
   npm run dev
   ```
   You should see: "Ready on http://localhost:3000"

## Option 2: Using Batch Scripts

I've created batch scripts for you. Just double-click:
- `start-backend.bat` - Starts backend server
- `start-frontend.bat` - Starts frontend server

## Troubleshooting

### If npm is not recognized:
1. Install Node.js from https://nodejs.org/
2. Restart your terminal after installation
3. Verify: `node --version` and `npm --version`

### If port 3000 or 5000 is already in use:
- Close other applications using those ports
- Or change the port in package.json/.env files

### If you see module errors:
- Run `npm install` in both backend and frontend directories

