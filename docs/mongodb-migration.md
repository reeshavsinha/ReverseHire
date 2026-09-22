# MongoDB Migration Plan

## Current state

The application currently stores records in `backend/store/dataStore.js`. The store is initialized from `backend/data/seedData.js` and is reset every time the backend starts.

No MongoDB connection or Mongoose dependency is currently required.

## Migration steps

### 1. Install Mongoose

From the backend directory:

```powershell
npm install mongoose
```

Add the connection string to `backend/.env`:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/reversehire
```

### 2. Add the database connection

Create a connection module such as:

```text
backend/config/db.js
```

Connect before registering or starting the Express server.

### 3. Add Mongoose schemas

Create:

```text
backend/models/Candidate.js
backend/models/Company.js
backend/models/Opportunity.js
backend/models/Post.js
```

Use the shapes documented in [`data-models.md`](data-models.md). Candidate and company references should use `ObjectId`.

### 4. Replace the store implementation

The preferred structure is:

```text
controllers → repositories → mongoose models → MongoDB
```

The repository should expose operations equivalent to the current store:

```text
list
findById
insert
update
remove
```

Add post-specific repository methods for comments and reaction toggles if those operations become easier to express directly in MongoDB.

### 5. Convert controllers to async

The current in-memory methods are synchronous. Mongoose queries return promises, so controllers should use `async`/`await` and the existing async middleware pattern.

Response shapes should remain unchanged so the frontend does not need a migration.

### 6. Create a database seed command

Replace the current in-memory seed inspection command with a script that:

1. Connects to MongoDB.
2. Clears the development collections.
3. Inserts candidates, companies, opportunities, and posts.
4. Prints inserted counts.
5. Closes the connection.

Do not run the clear step against a production database.

## Suggested collection strategy

Start with four collections:

```text
candidates
companies
opportunities
posts
```

Keep comments and reactions embedded inside posts for the first MongoDB version. Add separate collections only when feed pagination, moderation, or analytics requires them.

## Recommended indexes

```text
candidates: location
candidates: skills
candidates: preferredRoles
opportunities: candidate
opportunities: company
opportunities: status
posts: authorId
posts: type
posts: createdAt
```

## What should not change

- Frontend routes
- Frontend API service method names
- API response format
- Candidate/company/opportunity page behavior
- Social feed UI

The migration should change persistence, not the product contract.

