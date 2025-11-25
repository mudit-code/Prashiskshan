# Install Node.js - Required to Run the Project

## Quick Installation Guide

### Step 1: Download Node.js

1. **Go to the official Node.js website:**
   - Visit: https://nodejs.org/
   - You'll see two versions: **LTS (Recommended)** and **Current**
   - **Click on the LTS version** (Long Term Support - more stable)

2. **Download the Windows Installer:**
   - Click the download button for Windows
   - The file will be something like: `node-v20.x.x-x64.msi` (version numbers may vary)

### Step 2: Install Node.js

1. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - **IMPORTANT:** Make sure "Add to PATH" is checked (it should be by default)
   - Accept the license agreement
   - Choose installation location (default is fine)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

### Step 3: Verify Installation

1. **Close and reopen your PowerShell/Command Prompt** (IMPORTANT - to refresh PATH)

2. **Test Node.js:**
   ```powershell
   node --version
   ```
   Should show something like: `v20.x.x`

3. **Test npm:**
   ```powershell
   npm --version
   ```
   Should show something like: `10.x.x`

### Step 4: Start the Servers

Once Node.js is installed, you can start the project:

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main\backend"
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\Harsh\Downloads\Prashiskshan-main\Prashiskshan-main\frontend"
npm install
npm run dev
```

Or use the batch files I created:
- Double-click `start-both.bat` (starts both servers)

## Troubleshooting

### If npm is still not recognized after installation:

1. **Restart your computer** (this ensures PATH is fully updated)
2. **Or manually add to PATH:**
   - Open System Properties → Environment Variables
   - Add Node.js installation path (usually `C:\Program Files\nodejs\`)
   - Restart terminal

### Alternative: Use Node Version Manager (nvm-windows)

If you prefer managing multiple Node.js versions:
- Download from: https://github.com/coreybutler/nvm-windows/releases
- Install and use: `nvm install lts` then `nvm use lts`

## What Node.js Includes

- **Node.js**: JavaScript runtime for running server-side code
- **npm**: Node Package Manager (comes with Node.js) - used to install dependencies
- **npx**: Tool for executing packages (comes with npm)

Once installed, you'll be able to run `npm install` and `npm run dev` commands!

