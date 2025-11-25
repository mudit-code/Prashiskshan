@echo off
echo ========================================
echo Push to GitHub Repository
echo ========================================
echo.
echo Repository: https://github.com/mudit-code/Prashiskshan.git
echo.

cd /d "%~dp0Prashiskshan-main"

echo Checking Git installation...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git is installed.
echo.

echo Initializing Git repository...
if not exist ".git" (
    call git init
)

echo.
echo Adding remote repository...
call git remote remove origin 2>nul
call git remote add origin https://github.com/mudit-code/Prashiskshan.git
echo Remote added: https://github.com/mudit-code/Prashiskshan.git

echo.
echo Adding all files...
call git add .

echo.
echo Current status:
call git status

echo.
echo.
echo ========================================
echo Ready to commit and push!
echo ========================================
echo.
echo Next steps:
echo 1. Review the files above
echo 2. Run these commands:
echo.
echo    git commit -m "Update: Complete UI and backend integration"
echo    git pull origin main --allow-unrelated-histories
echo    git push -u origin main
echo.
echo Note: You'll need a GitHub Personal Access Token for authentication
echo Get one at: https://github.com/settings/tokens
echo.
pause

