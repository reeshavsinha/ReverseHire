# Development & Setup Guide

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v9.0.0 or higher
- **Git**: Installed for version control
- **MongoDB** *(Optional)*:
  - Local MongoDB instance (`mongodb://127.0.0.1:27017/reversehire`), OR
  - Free MongoDB Atlas cluster URI, OR
  - None required: The app automatically falls back to an in-memory database if MongoDB is not running.

---

## 2. Quick Start

### Step 1: Install Dependencies
From the repository root:

```powershell
npm run install:all
```
*(This installs root dependencies, backend dependencies including Mongoose, and frontend dependencies.)*

### Step 2: Configure Environment
Copy the example files if you wish to customize configuration:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Default `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/reversehire
```

Default `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: (Optional) Seed Initial Records
To populate your MongoDB database with sample candidates, companies, opportunities, and community posts:

```powershell
npm run seed --prefix backend
```

### Step 4: Run the Application
Launch both backend and frontend concurrently:

```powershell
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health & Storage Status**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 3. Running Services Independently

You can also run backend and frontend in separate terminals:

### Backend Only
```powershell
npm run dev --prefix backend
```
The server will boot with watch mode (`node --watch server.js`).

### Frontend Only
```powershell
npm run dev --prefix frontend
```
Vite development server starts on port `5173`.

---

## 4. Production Build

To test the frontend production build:

```powershell
npm run build --prefix frontend
```

The optimized bundle is generated in `frontend/dist/`.
To preview the production bundle locally:

```powershell
npm run preview --prefix frontend
```
