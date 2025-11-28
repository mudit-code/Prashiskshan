# Deployment Guide (Render)

This project is configured for easy deployment on **Render** using a Blueprint.

## Prerequisites
1.  A GitHub account.
2.  A [Render](https://render.com) account.

## Steps to Deploy

1.  **Push to GitHub**
    - Ensure all your changes are committed and pushed to your GitHub repository.
    - If you haven't pushed yet, follow the `PUSH_TO_GITHUB.md` guide.

2.  **Create a New Blueprint on Render**
    - Log in to your Render dashboard.
    - Click the **New +** button in the top right.
    - Select **Blueprint**.
    - Connect your GitHub repository (`Prashiskshan-main`).

3.  **Configure and Deploy**
    - Render will automatically detect the `render.yaml` file.
    - Review the services (Backend, Frontend, Database).
    - Click **Apply**.

4.  **Wait for Deployment**
    - Render will start building your services.
    - The **Database** will be created first.
    - The **Backend** will build and start (running migrations automatically).
    - The **Frontend** will build and start.

## Accessing Your App
- Once deployed, you will see the URL for your frontend service in the Render dashboard (e.g., `https://prashikshan-frontend.onrender.com`).
- You can access your application at that URL.

## Troubleshooting
- **Build Failures**: Check the logs in the Render dashboard.
- **Database Connection**: Ensure the `DATABASE_URL` environment variable is correctly set (Render handles this automatically with Blueprints).
- **CORS Errors**: If you see CORS errors, ensure the backend `ALLOWED_ORIGINS` environment variable matches your frontend URL.
