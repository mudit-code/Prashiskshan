# Connect to Existing GitHub Repository

The repository already exists at: https://github.com/mudit-code/Prashiskshan.git

## Steps to Push Your Code

### Step 1: Install Git (if not installed)
Download from: https://git-scm.com/download/win

### Step 2: Navigate to Project
```powershell
cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main"
```

### Step 3: Initialize Git (if not already initialized)
```powershell
git init
```

### Step 4: Add Remote Repository
```powershell
git remote add origin https://github.com/mudit-code/Prashiskshan.git
```

If you get "remote origin already exists", use:
```powershell
git remote set-url origin https://github.com/mudit-code/Prashiskshan.git
```

### Step 5: Check Current Status
```powershell
git status
```

### Step 6: Add All Files
```powershell
git add .
```

### Step 7: Commit Changes
```powershell
git commit -m "Update: Complete UI implementation and backend integration"
```

### Step 8: Pull Existing Code (if any)
```powershell
git pull origin main --allow-unrelated-histories
```

If there are conflicts, resolve them, then:
```powershell
git add .
git commit -m "Merge with existing repository"
```

### Step 9: Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

## Authentication

When prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

### Create Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Name: "Prashiskshan Project"
4. Select scope: **repo** (full control)
5. Click **Generate token**
6. **Copy the token** and use it as password

## Alternative: Using SSH (Recommended)

If you have SSH keys set up:

```powershell
git remote set-url origin git@github.com:mudit-code/Prashiskshan.git
git push -u origin main
```

## Quick Command Summary

```powershell
# Navigate to project
cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main"

# Initialize (if needed)
git init

# Add remote
git remote add origin https://github.com/mudit-code/Prashiskshan.git

# Add files
git add .

# Commit
git commit -m "Complete UI and backend integration"

# Pull first (to merge any existing code)
git pull origin main --allow-unrelated-histories

# Push
git push -u origin main
```

## Troubleshooting

### If you get "fatal: refusing to merge unrelated histories"
Use: `git pull origin main --allow-unrelated-histories`

### If you get authentication errors
- Use Personal Access Token instead of password
- Or set up SSH keys for easier authentication

### If you want to force push (overwrite remote)
⚠️ **Warning**: Only use if you're sure!
```powershell
git push -u origin main --force
```

## Future Updates

After initial push, to update:
```powershell
git add .
git commit -m "Description of changes"
git push
```

