@echo off
echo Starting Both Servers...
echo.
echo This will open two windows - one for backend, one for frontend
echo.

start "Backend Server" cmd /k "cd /d %~dp0Prashiskshan-main\backend && if not exist node_modules npm install && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd /d %~dp0Prashiskshan-main\frontend && if not exist node_modules npm install && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend will be on http://localhost:5000
echo Frontend will be on http://localhost:3000
echo.
pause

