# Data Models & Schemas

The database schema is defined using **Mongoose** models located in `backend/models/`. Application-level string identifiers (e.g. `candidate-1`, `company-1`) are indexed and unique to maintain seamless continuity between frontend and backend operations.

---

## 1. Candidate Schema (`models/Candidate.js`)

Represents job-seeking candidates with rich portfolio, experience, and project data.

```javascript
{
  id: { type: String, unique: true, index: true, required: true },
  name: { type: String, required: true, trim: true },
  headline: { type: String, required: true, trim: true },
  about: { type: String, required: true },
  skills: { type: [String], required: true },
  education: { type: String, required: true },
  location: { type: String, required: true },
  preferredWorkMode: {
    type: String,
    enum: ["REMOTE", "HYBRID", "ONSITE"],
    required: true
  },
  preferredRoles: { type: [String], required: true },
  availability: {
    type: String,
    enum: ["IMMEDIATELY", "ONE_MONTH", "THREE_MONTHS", "NOT_LOOKING"],
    required: true
  },
  portfolioUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  profilePhotoUrl: { type: String, default: "" },
  coverPhotoUrl: { type: String, default: "" },
  pronouns: { type: String, default: "" },
  experience: [experienceSchema],
  projects: [projectSchema],
  featuredPostIds: { type: [String], default: [] },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

### Subdocuments:

- **Experience Subdocument (`experienceSchema`)**:
  ```javascript
  {
    id: String,
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: String,
    endDate: String,
    description: { type: String, required: true }
  }
  ```

- **Project Subdocument (`projectSchema`)**:
  ```javascript
  {
    id: String,
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["CURRENT", "UPCOMING", "COMPLETED"],
      required: true
    },
    techStack: [String],
    projectUrl: String,
    mediaUrl: String
  }
  ```

---

## 2. Company Schema (`models/Company.js`)

Represents recruiting companies and prospective employers.

```javascript
{
  id: { type: String, unique: true, index: true, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String, default: "" },
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    required: true
  },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

---

## 3. Opportunity Schema (`models/Opportunity.js`)

Connects companies to candidates for job offers, placement interviews, and outreach.

```javascript
{
  id: { type: String, unique: true, index: true, required: true },
  candidate: { type: String, required: true, index: true },
  company: { type: String, required: true, index: true },
  roleTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  workMode: {
    type: String,
    enum: ["REMOTE", "HYBRID", "ONSITE"],
    required: true
  },
  compensation: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "DECLINED"],
    default: "PENDING",
    index: true
  },
  respondedAt: { type: Date, default: null },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

---

## 4. Post Schema (`models/Post.js`)

Represents community updates, showcase posts, and technical demonstrations shared by candidates.

```javascript
{
  id: { type: String, unique: true, index: true, required: true },
  authorId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["TEXT", "PROJECT", "VIDEO"],
    required: true
  },
  content: { type: String, required: true },
  mediaUrl: { type: String, default: "" },
  mediaType: { type: String, default: "" },
  projectTitle: { type: String, default: "" },
  projectStatus: { type: String, default: "" },
  projectUrl: { type: String, default: "" },
  comments: [commentSchema],
  reactions: [reactionSchema],
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

### Subdocuments:

- **Comment Subdocument (`commentSchema`)**:
  ```javascript
  {
    id: String,
    authorId: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
  ```

- **Reaction Subdocument (`reactionSchema`)**:
  ```javascript
  {
    candidateId: { type: String, required: true },
    type: {
      type: String,
      enum: ["LIKE", "CELEBRATE", "INSIGHTFUL"],
      required: true
    }
  }
  ```

---

## 5. Indexes and Query Performance

- **Fast Candidate Filtering**: Indexes on `id`, `skills`, and `preferredRoles` support responsive search across hundreds of profiles.
- **Relational Integrity**: Foreign string keys (`candidate`, `company`, `authorId`) are indexed to optimize populating joins and cascading deletes without table scans.
- **Timeline Sorting**: Automatic timestamps (`createdAt`, `updatedAt`) indexed for descending order sorting across the community feed and opportunity inboxes.
