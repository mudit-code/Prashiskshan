# Push Project to GitHub - Step by Step Guide

## Prerequisites

### Step 1: Install Git

1. **Download Git for Windows:**
   - Visit: https://git-scm.com/download/win
   - Download the installer
   - Run the installer and follow the setup wizard
   - Use default settings (they're fine for most users)

2. **Verify Installation:**
   - Open a new PowerShell/Command Prompt
   - Run: `git --version`
   - Should show something like: `git version 2.x.x`

### Step 2: Create GitHub Account (if you don't have one)

1. Go to: https://github.com/
2. Sign up for a free account
3. Verify your email

## Pushing to GitHub

### Step 3: Initialize Git Repository

Open PowerShell/Command Prompt in the project root:
```powershell
cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main"
```

Initialize git (if not already initialized):
```powershell
git init
```

### Step 4: Configure Git (First time only)

Set your name and email:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 5: Add Files to Git

Add all files:
```powershell
git add .
```

Check what will be committed:
```powershell
git status
```

### Step 6: Create Initial Commit

```powershell
git commit -m "Initial commit: Prashikshan internship platform"
```

### Step 7: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `prashikshan` (or any name you prefer)
3. Description: "Internship platform for students, colleges, and employers"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

### Step 8: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/prashikshan.git

# Or if you prefer SSH (requires SSH key setup):
# git remote add origin git@github.com:YOUR_USERNAME/prashikshan.git
```

### Step 9: Push to GitHub

```powershell
# Push to main branch
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

### Step 10: Create Personal Access Token (if needed)

If GitHub asks for a password:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: "Prashikshan Project"
4. Select scopes: Check **repo** (full control of private repositories)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## Quick Commands Summary

```powershell
# Navigate to project
cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main"

# Initialize (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Your commit message"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/prashikshan.git

# Push
git push -u origin main
```

## Future Updates

After the initial push, to update GitHub:

```powershell
git add .
git commit -m "Description of changes"
git push
```

## Troubleshooting

### If you get "fatal: not a git repository"
- Make sure you're in the project root directory
- Run `git init` first

### If you get authentication errors
- Use Personal Access Token instead of password
- Or set up SSH keys for easier authentication

### If you want to remove sensitive data
- Check `.gitignore` file
- Never commit `.env` files with real secrets
- If already committed, use `git rm --cached .env` then commit

## Repository Structure

Your repository will include:
- ✅ Frontend (Next.js + React + TypeScript)
- ✅ Backend (Node.js + Express + TypeScript)
- ✅ Database schema (Prisma)
- ✅ Documentation files
- ✅ Configuration files

Will NOT include (thanks to .gitignore):
- ❌ node_modules/
- ❌ .env files
- ❌ Database files
- ❌ Build outputs
- ❌ Log files

## Next Steps After Pushing

1. Add a README.md with project description
2. Add LICENSE file if needed
3. Set up GitHub Actions for CI/CD (optional)
4. Add collaborators if working in a team
5. Enable GitHub Pages for documentation (optional)

