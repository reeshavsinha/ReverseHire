# Vercel Deployment Guide

ReverseHire is pre-configured for seamless deployment to **Vercel** with both the React (Vite) frontend and the Express (Node.js) REST API running on the same domain.

---

## 1. Quick Deploy via Vercel Dashboard (Recommended)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** $\rightarrow$ **"Project"**.
2. Select your GitHub repository: `reeshavsinha/ReverseHire`.
3. In the project settings:
   - **Framework Preset**: Leave as *Other* or *Vite* (Vercel will detect `vercel.json`).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` (or leave default).
   - **Output Directory**: `frontend/dist` (auto-configured via `vercel.json`).
4. **Environment Variables**:
   Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/reversehire?retryWrites=true&w=majority`).
   - *(Optional)* `CLIENT_URL`: `https://<your-project-name>.vercel.app`
5. Click **"Deploy"**.

---

## 2. Setting Up a Free MongoDB Atlas Database

Since Vercel functions are serverless, connecting to a cloud database ensures your data persists across all serverless invocations:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user with read/write permissions.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere, required for serverless cloud hosts like Vercel).
5. Click **"Connect"** $\rightarrow$ **"Drivers"** $\rightarrow$ Copy the connection string.
6. Paste the connection string as `MONGODB_URI` in your Vercel Project Environment Variables.

*(Note: Even without MongoDB Atlas configured, ReverseHire's graceful fallback ensures the app runs with the demo in-memory dataset).*

---

## 3. How the Vercel Architecture Operates

- **Frontend**: Vite builds the static SPA into `frontend/dist`. Any navigation route (e.g. `/candidates`, `/dashboard`, `/community`) is rewritten to `/index.html` for client-side routing.
- **Backend API**: Handled by Vercel Serverless Functions via `/api/index.js` which exports the Express app. Any request to `/api/*` routes directly to the Express serverless function.
- **Same-Origin API Calls**: Because frontend and backend are hosted on the same domain, API calls use relative paths (`/api/candidates`, `/api/opportunities`) with zero CORS complications.
