# ReverseHire - Mini Full-Stack Placement & Reverse-Recruitment Portal

ReverseHire is a full-stack web application developed for the **Portfolio-Driven Assessment (Placement Portal)**. It flips traditional recruiting: candidates publish rich profiles and community updates, companies discover talent using search/filters, and companies send job opportunities directly to candidates who can review, accept, or decline them.

---

## Scope & Academic Requirements Checklist

| Requirement | Implementation in ReverseHire | Status |
| :--- | :--- | :---: |
| **Suggested Topic** | **Placement Portal** / Talent Matching Platform | Complete |
| **Frontend** | React 18, React Router v7, Modern Responsive CSS, Component Architecture | Complete |
| **Backend** | Node.js + Express.js REST API with modular routes, controllers, and validation | Complete |
| **Database** | MongoDB via Mongoose Models (`Candidate`, `Company`, `Opportunity`, `Post`) | Complete |
| **Dual-Mode Resiliency** | Automatic graceful fallback to in-memory `DataStore` if MongoDB is offline | Complete |
| **Full CRUD** | Create, Read, Update, Delete across all entities (UI + API) | Complete |
| **Version Control** | Git repository initialized, clean commit history ready for GitHub | Complete |

---

## CRUD Operations Overview

The application demonstrates complete CRUD functionality both through the REST API and the React frontend:

- **Create**:
  - Register new candidates (`POST /api/candidates`) via `/candidates/new`
  - Register new companies (`POST /api/companies`) via `/companies/new`
  - Send opportunities to candidates (`POST /api/opportunities`) via `/opportunities/new`
  - Publish community posts, updates & videos (`POST /api/posts`) via `/community`
  - Add comments to posts (`POST /api/posts/:id/comments`)
- **Read**:
  - Search and filter candidate directory by skills, role, and location (`GET /api/candidates`)
  - View individual candidate profiles with projects and experience (`GET /api/candidates/:id`)
  - Company directory and profiles (`GET /api/companies`, `GET /api/companies/:id`)
  - Opportunities inbox & sent list (`GET /api/opportunities`)
  - Community feed (`GET /api/posts`)
- **Update**:
  - Edit candidate profile and portfolio links (`PUT /api/candidates/:id`) via `/candidates/:id/edit`
  - Edit company profile details (`PUT /api/companies/:id`) via `/companies/:id/edit`
  - Respond to job opportunities (`PATCH /api/opportunities/:id/accept` and `PATCH /api/opportunities/:id/decline`)
  - Edit community posts (`PUT /api/posts/:id`)
  - Toggle post reactions (`PATCH /api/posts/:id/reactions`)
- **Delete**:
  - Delete candidate profile with cascading opportunity cleanup (`DELETE /api/candidates/:id`)
  - Delete company profile with cascading opportunity cleanup (`DELETE /api/companies/:id`)
  - Withdraw opportunity (`DELETE /api/opportunities/:id`)
  - Delete community post (`DELETE /api/posts/:id`)
  - Remove comment (`DELETE /api/posts/:id/comments/:commentId`)

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Vanilla CSS with custom design tokens.
- **Backend**: Node.js, Express.js, CORS, Dotenv.
- **Database**: MongoDB with Mongoose ODM (includes Candidate, Company, Opportunity, and Post schemas).
- **API**: Standardized JSON REST API with structured response contracts (`{ success, data, message, errors }`).

---

## Running the Application Locally

### 1. Install dependencies

From the project root:

```powershell
npm run install:all
```

### 2. Configure Environment (Optional)

`backend/.env` is pre-configured with:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/reversehire
```

> **Note on MongoDB**: If you have a local MongoDB instance running or provide a MongoDB Atlas cloud URI, the app automatically stores and queries data in MongoDB. If MongoDB is not running, the application **automatically and gracefully falls back** to the in-memory DataStore so the application always runs without errors.

### 3. Seed Database (Optional)

To populate MongoDB collections with initial demo candidates, companies, opportunities, and posts:

```powershell
npm run seed --prefix backend
```

### 4. Start Full Stack Application

Run both frontend and backend concurrently:

```powershell
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health & Storage Status**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Architecture & Directory Structure

```text
Portfolio/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection + fallback detection
│   ├── controllers/            # Async CRUD handlers
│   │   ├── candidateController.js
│   │   ├── companyController.js
│   │   ├── opportunityController.js
│   │   └── postController.js
│   ├── data/
│   │   └── seedData.js         # Comprehensive demo dataset
│   ├── middleware/             # Error and 404 handlers
│   ├── models/                 # Mongoose schemas
│   │   ├── Candidate.js
│   │   ├── Company.js
│   │   ├── Opportunity.js
│   │   └── Post.js
│   ├── routes/                 # Express REST endpoints
│   ├── seed/                   # Database seeding script
│   ├── store/                  # In-memory fallback DataStore
│   └── server.js               # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI cards, forms, navbar
│   │   ├── context/            # Role and identity management
│   │   ├── pages/              # Directory, Profiles, Forms, Dashboard, Feed
│   │   ├── services/           # Fetch API client (api.js)
│   │   └── styles/             # Modular CSS design system
│   └── index.html
└── docs/
    └── api.md                  # Complete REST API reference
```
