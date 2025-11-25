@echo off
echo Starting Frontend Server...
cd /d "%~dp0Prashiskshan-main\frontend"
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
if not exist ".env.local" (
    echo Creating .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000
    ) > .env.local
)
echo Starting frontend server on port 3000...
call npm run dev
pause

