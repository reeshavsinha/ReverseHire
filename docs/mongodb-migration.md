# MongoDB Integration & Architecture Report

## 1. Executive Summary

ReverseHire has successfully transitioned from an initial prototype with in-memory storage to a production-ready **MongoDB + Mongoose** database architecture, featuring a resilient **dual-engine graceful fallback** to ensure zero downtime when offline.

---

## 2. Migration Objectives & Results

| Objective | Implementation Details | Result |
| :--- | :--- | :---: |
| **Preserve API Contract** | Endpoints, query parameters, and JSON response shapes retained without modifying the React frontend. | Complete |
| **Mongoose ODM Schemas** | Created schemas for `Candidate`, `Company`, `Opportunity`, and `Post` with validation and indexing. | Complete |
| **Asynchronous Controllers** | Migrated controllers to `async/await` leveraging idiomatic Mongoose query methods. | Complete |
| **Cascading Integrity** | Deleting a candidate or company triggers `Opportunity.deleteMany()` to clean up dangling records. | Complete |
| **Batch Hydration** | Multi-record opportunity and post listings use batch lookups to eliminate N+1 queries. | Complete |
| **Resilient Graceful Fallback**| If MongoDB is not reachable or unconfigured, the server gracefully reverts to the in-memory `DataStore`. | Complete |

---

## 3. Database Models Implemented

All models are placed in `backend/models/`:

1. **`Candidate.js`**: Stores candidate placement profiles, skills, education, availability, embedded experiences, and embedded projects.
2. **`Company.js`**: Stores hiring companies, sizes, industry, and location.
3. **`Opportunity.js`**: Connects candidates and companies with compensation, role description, and status lifecycles (`PENDING`, `ACCEPTED`, `DECLINED`).
4. **`Post.js`**: Houses candidate social and project feed items with embedded comments and reactions.

---

## 4. Dual-Engine Controller Pattern

Rather than failing on boot if a database service is unavailable, each controller checks `isMongoConnected()` from `config/db.js`:

```javascript
// Example: candidateController.js
export async function listCandidates(req, res, next) {
  try {
    const { skill, role, location } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (skill) query.skills = { $regex: skill, $options: "i" };
      if (role) query.preferredRoles = { $regex: role, $options: "i" };
      if (location) query.location = { $regex: location, $options: "i" };

      const candidates = await Candidate.find(query).lean();
      return res.json({ success: true, data: candidates });
    }

    // Resilient Fallback: In-memory store
    let candidates = store.list("candidates");
    // ... in-memory filtering ...
    return res.json({ success: true, data: candidates });
  } catch (error) {
    next(error);
  }
}
```

---

## 5. Seeding the Database

A repeatable database seed script is provided at `backend/seed/seed.js`:

```powershell
npm run seed --prefix backend
```

**Seeding Flow:**
1. Connects to `process.env.MONGODB_URI` with a 3-second timeout.
2. Clears existing collections (`deleteMany({})`).
3. Inserts initial candidates, companies, opportunities, and posts from `data/seedData.js`.
4. Disconnects cleanly from MongoDB.
5. If MongoDB is offline, it safely resets the in-memory fallback store without crashing.

---

## 6. Verification and Health Monitoring

The API exposes its active database state via `GET /api/health`:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "storage": "mongodb",
    "mongoReadyState": 1,
    "fallbackActive": false,
    "message": "Connected to MongoDB."
  }
}
```

When operating in offline fallback mode:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "storage": "in-memory",
    "mongoReadyState": 2,
    "fallbackActive": true,
    "message": "Operating in in-memory fallback mode (MongoDB unreachable or unconfigured)."
  }
}
```
