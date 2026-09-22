# REST API Reference

Base URL:

```text
http://localhost:5000/api
```

All successful responses return a standard JSON envelope:

```json
{
  "success": true,
  "data": ...
}
```

Validation failures return HTTP `400` with descriptive error lists; missing records return HTTP `404`; conflicting states return HTTP `409`.

---

## 1. Health & Storage Status

```text
GET /health
```

Returns current system status, active database engine, and connection state.

**Response Example:**

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

*(Note: When MongoDB is offline, `storage` returns `"in-memory"` with `fallbackActive: true`.)*

---

## 2. Candidates (Placement Profiles)

```text
GET    /candidates?skill=&role=&location=
GET    /candidates/:id
POST   /candidates
PUT    /candidates/:id
DELETE /candidates/:id
```

### Search & Filtering Query Params:
- `skill`: Case-insensitive partial match on candidate skills.
- `role`: Case-insensitive partial match on preferred roles.
- `location`: Case-insensitive partial match on candidate location.

### Candidate Request Body Example (POST / PUT):

```json
{
  "name": "Maya Patel",
  "headline": "Frontend engineer building thoughtful product experiences",
  "about": "Frontend engineer with four years of experience building accessible interfaces.",
  "skills": ["React", "TypeScript", "Accessibility", "Design Systems"],
  "education": "B.Tech in Computer Science, VIT University",
  "location": "Bengaluru, India",
  "preferredWorkMode": "HYBRID",
  "preferredRoles": ["Frontend Engineer", "Product Engineer"],
  "availability": "IMMEDIATELY",
  "portfolioUrl": "https://mayapatel.dev",
  "githubUrl": "https://github.com/mayapatel",
  "profilePhotoUrl": "",
  "coverPhotoUrl": "",
  "pronouns": "she/her",
  "experience": [
    {
      "title": "Frontend Engineer",
      "company": "Northstar Labs",
      "startDate": "2023-04",
      "endDate": "",
      "description": "Building accessible workflow tools and a shared React design system."
    }
  ],
  "projects": [
    {
      "title": "Northstar workflow builder",
      "description": "A calmer way for operations teams to automate repeatable work.",
      "status": "CURRENT",
      "techStack": ["React", "TypeScript", "Storybook"],
      "projectUrl": "https://mayapatel.dev/workflow-builder"
    }
  ]
}
```

### Deletion Behavior:
Deleting a candidate (`DELETE /api/candidates/:id`) automatically cascades and deletes all associated opportunities sent to that candidate.

---

## 3. Companies (Recruiters & Employers)

```text
GET    /companies
GET    /companies/:id
POST   /companies
PUT    /companies/:id
DELETE /companies/:id
```

### Company Request Body Example (POST / PUT):

```json
{
  "name": "Northstar Labs",
  "description": "Northstar Labs builds tools that help modern teams make better decisions with less operational noise.",
  "industry": "Developer Tools",
  "location": "Bengaluru, India",
  "website": "https://northstarlabs.example.com",
  "companySize": "11-50"
}
```

Allowed `companySize` values: `"1-10"`, `"11-50"`, `"51-200"`, `"201-500"`, `"500+"`.

---

## 4. Opportunities (Placement Offers & Outreach)

```text
GET    /opportunities?candidateId=&companyId=&status=
GET    /opportunities/:id
POST   /opportunities
PUT    /opportunities/:id
DELETE /opportunities/:id
PATCH  /opportunities/:id/accept
PATCH  /opportunities/:id/decline
```

### Opportunity Query Params:
- `candidateId`: Filter by candidate recipient ID.
- `companyId`: Filter by issuing company ID.
- `status`: Filter by status (`PENDING`, `ACCEPTED`, `DECLINED`).

### Create Opportunity Body Example (POST):

```json
{
  "candidate": "candidate-1",
  "company": "company-1",
  "roleTitle": "Senior Frontend Engineer",
  "description": "Own the next generation of our workflow builder and component architecture.",
  "location": "Bengaluru, India",
  "workMode": "HYBRID",
  "compensation": "₹28–36 LPA",
  "message": "Maya, your work on accessible interfaces stood out to our team."
}
```

### Responding to Opportunities:
- `PATCH /api/opportunities/:id/accept`: Sets status to `ACCEPTED` and updates `respondedAt`.
- `PATCH /api/opportunities/:id/decline`: Sets status to `DECLINED` and updates `respondedAt`.
- *Note:* Only `PENDING` opportunities can be accepted, declined, or edited.

---

## 5. Candidate Community Feed & Posts

```text
GET    /posts?authorId=&type=&viewerId=
GET    /posts/:id?viewerId=
POST   /posts
PUT    /posts/:id
DELETE /posts/:id?actorId=
POST   /posts/:id/comments
DELETE /posts/:id/comments/:commentId?candidateId=
PATCH  /posts/:id/reactions
```

### Post Types:
- `TEXT`: Thought-sharing, status updates.
- `PROJECT`: Showcasing new projects, repositories, or demos.
- `VIDEO`: Video links and demonstrations.

### Create Post Example:

```json
{
  "authorId": "candidate-1",
  "type": "PROJECT",
  "content": "I have been working on a calmer workflow builder for operations teams.",
  "projectTitle": "Northstar workflow builder",
  "projectStatus": "CURRENT",
  "projectUrl": "https://mayapatel.dev/workflow-builder"
}
```

### Add Comment Example (`POST /api/posts/:id/comments`):

```json
{
  "candidateId": "candidate-2",
  "body": "This is such a good product principle!"
}
```

### Toggle Reaction Example (`PATCH /api/posts/:id/reactions`):

```json
{
  "candidateId": "candidate-2",
  "type": "LIKE"
}
```

Supported reaction types: `"LIKE"`, `"CELEBRATE"`, `"INSIGHTFUL"`. Toggling the same reaction removes it.

---

## 6. Response Codes & Error Standards

| HTTP Code | Meaning | Description |
| :--- | :--- | :--- |
| `200 OK` | Success | Standard response for GET, PUT, PATCH. |
| `201 Created` | Success | Record successfully created (POST). |
| `204 No Content` | Success | Record successfully deleted (DELETE). |
| `400 Bad Request` | Client Error | Validation failed; check `errors` array. |
| `403 Forbidden` | Client Error | Action not permitted for the given author/candidate. |
| `404 Not Found` | Client Error | Resource or subdocument does not exist. |
| `409 Conflict` | Client Error | Illegal state transition (e.g. updating non-pending opportunity). |
| `500 Server Error` | Server Error | Internal server error; details caught by centralized error middleware. |
