@echo off
echo Starting Backend Server...
cd /d "%~dp0Prashiskshan-main\backend"
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
if not exist ".env" (
    echo Creating .env file...
    (
        echo JWT_SECRET=your_super_secret_jwt_key_12345
        echo REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_12345
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo .env file created. Please update with your own secrets.
)
echo Starting backend server on port 5000...
call npm run dev
pause

