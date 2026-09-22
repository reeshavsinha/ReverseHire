# Development Setup

## Prerequisites

- Node.js LTS
- npm
- Git
- A modern browser

MongoDB is not required for the current version.

## Install dependencies

From the project root:

```powershell
npm install
npm run install:all
```

## Start the application

Run both frontend and backend:

```powershell
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health: `http://localhost:5000/api/health`

If port `5173` or `5000` is already in use, stop the existing process or configure another port through environment variables.

## Run each application separately

Backend:

```powershell
npm run dev --prefix backend
```

Frontend:

```powershell
npm run dev --prefix frontend
```

## Environment variables

Copy the example files when environment-specific configuration is needed:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Backend:

```text
PORT=5000
CLIENT_URL=http://localhost:5173
```

Frontend:

```text
VITE_API_URL=http://localhost:5000/api
```

## Seed data

The backend loads seed data automatically on startup. To run the seed inspection command:

```powershell
npm run seed --prefix backend
```

Current seed counts:

- 5 candidates
- 3 companies
- 6 opportunities
- 6 social posts

Since storage is in memory, all changes reset when the backend restarts.

## Production build

```powershell
npm run build --prefix frontend
```

The output is generated in `frontend/dist/`.

