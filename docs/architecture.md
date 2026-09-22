# ReverseHire Architecture

## 1. System Overview

ReverseHire is a full-stack web application designed for candidate discovery, placement, and reverse recruitment. Built for the Portfolio-Driven Assessment, it combines a responsive React single-page frontend, an Express REST API, and a MongoDB persistence layer with an automatic, resilient fallback engine.

```mermaid
flowchart TD
  subgraph Frontend["Frontend Layer (React 18 + Vite)"]
    UI[Components & Pages]
    Context[Demo Context & State]
    ApiClient[API Service Layer (api.js)]
  end

  subgraph Backend["Backend Layer (Node.js + Express)"]
    Server[server.js & Middleware]
    Routes[Express Routers]
    Controllers[Async Controllers]
    Validation[Validation & Utils]
  end

  subgraph Persistence["Persistence & Database Layer"]
    Models[Mongoose Schemas & Models]
    MongoDB[(MongoDB Database)]
    FallbackStore[(In-Memory DataStore Fallback)]
  end

  UI --> Context
  UI --> ApiClient
  ApiClient -->|HTTP REST / JSON| Server
  Server --> Routes
  Routes --> Controllers
  Controllers --> Validation
  Controllers --> Models
  Models -->|Active Connection| MongoDB
  Controllers -.->|Offline / Fallback| FallbackStore
```

---

## 2. Directory Structure

```text
Portfolio/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection + connection state checks
│   ├── controllers/            # Async REST controller handlers
│   │   ├── candidateController.js
│   │   ├── companyController.js
│   │   ├── opportunityController.js
│   │   └── postController.js
│   ├── data/
│   │   └── seedData.js         # Initial mock records (candidates, companies, opportunities, posts)
│   ├── middleware/             # Centralized async & error handling
│   ├── models/                 # Mongoose Data Models
│   │   ├── Candidate.js
│   │   ├── Company.js
│   │   ├── Opportunity.js
│   │   └── Post.js
│   ├── routes/                 # Express router definitions
│   ├── seed/
│   │   └── seed.js             # MongoDB seeding script
│   ├── store/
│   │   └── dataStore.js        # In-memory store used for offline fallback
│   ├── utils/
│   │   └── validation.js       # Payload validation & sanitization
│   └── server.js               # Application entry point & health check
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI pieces (Navbar, Cards, Forms, Badges)
│   │   ├── context/            # Role and identity state (DemoContext)
│   │   ├── hooks/              # Shared React hooks (useFetch)
│   │   ├── pages/              # Route views (Discovery, Profiles, Forms, Inbox, Feed)
│   │   ├── services/           # Fetch API client (api.js)
│   │   └── styles/             # Design tokens and global CSS
│   └── index.html
└── docs/                       # Architectural and technical documentation
```

---

## 3. Frontend Architecture

The frontend is built as a single-page application (SPA) with **React 18** and **Vite**:

- **Routing**: `react-router-dom` handles page navigation across Candidate Discovery, Profiles, Dashboards, Opportunity Inbox, and Community Feed.
- **Data Fetching Layer**: `services/api.js` centralizes all HTTP interactions with standard error formatting and query building.
- **Identity Simulation**: `DemoContext.jsx` manages the active user role (`candidate` or `company`), persisting selections to `localStorage` for realistic testing without requiring heavy authentication.
- **Styling**: Vanilla CSS utilizing CSS Custom Properties (`styles/tokens.css`) for consistent typography, modern color palettes, smooth hover states, and responsive flex/grid layouts.

### User Workflows by Role

```text
Candidate Role:
- Candidate Dashboard (/dashboard)
- Community Feed & Discussion (/community)
- Candidate Profile & Editing (/candidates/:id, /candidates/:id/edit)
- Opportunity Inbox (/inbox) -> Accept / Decline offers

Company Role:
- Candidate Discovery (/candidates) -> Filter by skills, role, location
- Send Opportunity (/opportunities/new)
- Sent Outreach Log (/sent)
- Company Profile (/companies/:id)
```

---

## 4. Backend Architecture

The backend follows clean separation of concerns:

1. **Routing (`routes/`)**: Maps standard REST endpoints to specific controller actions.
2. **Controllers (`controllers/`)**:
   - Implemented with modern `async/await` patterns.
   - Enforces business logic (e.g. only pending opportunities can be edited/accepted).
   - Manages cascading deletes (e.g. deleting a candidate automatically purges associated opportunities).
   - Optimizes database access with batch hydration to avoid N+1 queries.
3. **Mongoose Models (`models/`)**: Structured schemas providing type casting, validation, and indexes.
4. **Validation (`utils/validation.js`)**: Pure validation functions ensuring data integrity before persistence.
5. **Centralized Error Handling (`middleware/errorHandler.js`)**: Standardized HTTP status codes and JSON error responses.

---

## 5. Dual-Engine Persistence Lifecycle

To guarantee application availability across any evaluation environment:

```text
Server Boot
   │
   ▼
Attempt MongoDB Connection (with 2.5s timeout)
   │
   ├─► Connected:
   │     - Set isMongoConnected() = true
   │     - Controllers execute Mongoose queries (Candidate.find, etc.)
   │     - Health check reports: storage: "mongodb"
   │
   └─► Connection Failed / MONGODB_URI Unset:
         - Set isMongoConnected() = false (Graceful Fallback)
         - Log warning and activate in-memory DataStore
         - Controllers execute DataStore operations
         - Health check reports: storage: "in-memory", fallbackActive: true
```

This guarantees that:
1. When MongoDB is available (locally or via MongoDB Atlas), full database persistence is utilized.
2. If MongoDB is offline or not installed, the entire application remains fully functional with zero crashes.
