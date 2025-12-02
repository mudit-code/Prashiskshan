# Tech Stack Comparison Report

This report compares the **Proposed Tech Stack** with the **Current Implementation** found in the codebase.

## 📊 Summary Dashboard

| Category | Feature | Status | Current Implementation |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js + TypeScript | ✅ Matched | Next.js 14 + TypeScript 5.4 |
| | TailwindCSS | ✅ Matched | TailwindCSS 3.4 |
| | React Query | ❌ Missing | Not installed. Using `axios` + `useEffect` or Server Actions? |
| | PWA | ✅ Matched | `@ducanh2912/next-pwa` installed |
| **Mobile App** | Expo (React Native) | ❌ Missing | No mobile app codebase found |
| **Backend** | NestJS | ❌ Different | **Express.js** is used instead of NestJS |
| | Class-validator | ⚠️ Partial | **Zod** is used for validation (which is good, but different) |
| **Database** | PostgreSQL (Supabase) | ❌ Different | **SQLite** (`file:./dev.db`) is currently configured in Prisma |
| | Prisma ORM | ✅ Matched | Prisma is used |
| **Auth** | Supabase / Auth0 / Keycloak | ❌ Different | **Custom JWT Auth** implemented (Bcrypt + JWT + Refresh Tokens) |
| **Storage** | Supabase / S3 / R2 | ❌ Different | **Local Filesystem** (`/uploads` directory served statically) |
| **Realtime** | Socket.IO + FCM | ❌ Missing | No realtime features implemented |
| **Cache/Queue** | Redis + BullMQ | ❌ Missing | No caching or background job queues implemented |
| **Infrastructure** | GitHub Actions | ✅ Matched | `.github/workflows/ci.yml` exists |
| | Deployment | ✅ Matched | `render.yaml` exists for Backend. Frontend likely Vercel. |
| **Testing** | Jest / Supertest / Playwright | ❌ Missing | No test scripts or test files found |
| **Security** | HTTPS, HttpOnly Cookies | ✅ Matched | HttpOnly cookies used for refresh tokens |
| | Rate Limiting | ✅ Matched | `express-rate-limit` implemented |
| | Signed URLs | ❌ Missing | Public static file serving used instead |

---

## 🔍 Detailed Analysis

### 1. Frontend (Web)
- **Current:** The frontend is a **Next.js 14** application with **TypeScript** and **TailwindCSS**.
- **Missing:** **React Query** is not installed. The project likely relies on `useEffect` or Next.js data fetching methods.
- **PWA:** PWA support is configured using `@ducanh2912/next-pwa`.

### 2. Mobile App
- **Current:** **None**. There is no `mobile` directory or React Native configuration in the codebase.

### 3. Backend
- **Current:** The backend is built with **Express.js**, not NestJS.
- **Validation:** Uses **Zod** (`zod` package) for schema validation instead of `class-validator`.
- **Logging:** Uses `winston` for logging.

### 4. Database
- **Current:** The project is configured to use **SQLite** (`provider = "sqlite"` in `schema.prisma`).
- **Action Required:** To use Supabase/PostgreSQL, the `datasource` provider in `schema.prisma` needs to be changed to `postgresql` and the `DATABASE_URL` environment variable updated.

### 5. Authentication
- **Current:** A custom authentication system is implemented using `bcrypt` for password hashing and `jsonwebtoken` for Access/Refresh tokens.
- **Difference:** It does **not** use Supabase Auth, Auth0, or Keycloak.

### 6. File Storage
- **Current:** Files are uploaded using `multer` and stored locally in the `uploads/` directory. They are served statically via Express.
- **Difference:** No cloud storage (S3/Supabase) is integrated. This will not work well on serverless/ephemeral hosting (like Render Free Tier) as files will be lost on restart/redeploy.

### 7. Realtime & Background Jobs
- **Current:** No `socket.io` or `bullmq` dependencies found.
- **Impact:** No realtime notifications or background processing capabilities currently exist.

### 8. Testing
- **Current:** No testing framework (Jest, Supertest, Playwright) is set up. `package.json` scripts do not include test commands.

### 9. Security
- **Implemented:**
    - `helmet` for HTTP headers.
    - `express-rate-limit` for API rate limiting.
    - `cors` for Cross-Origin Resource Sharing.
    - `bcrypt` for password hashing.
    - HttpOnly cookies for refresh tokens.
- **Missing:**
    - Signed URLs for secure file access.
    - CSP (Content Security Policy) needs careful configuration.
    - CSRF protection (though SameSite cookies help).

## 💡 Recommendations

1.  **Database Migration:** Switch `schema.prisma` to `postgresql` to match the requirement and ensure compatibility with Supabase.
2.  **File Storage:** Implement an S3-compatible storage provider (Supabase Storage or R2) immediately if deploying to Render, as local files will persist only temporarily.
3.  **Testing:** Initialize Jest and Supertest to begin writing backend tests.
4.  **Mobile App:** Initialize the Expo project if a mobile app is required.
