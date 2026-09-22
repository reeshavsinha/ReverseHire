# REST API Reference

Base URL:

```text
http://localhost:5000/api
```

All successful responses use `{ "success": true, "data": ... }`. Validation failures return HTTP `400`; missing records return `404`; invalid state transitions return `409`.

## Health

```text
GET /health
```

## Candidates

```text
GET    /candidates?skill=&role=&location=
GET    /candidates/:id
POST   /candidates
PUT    /candidates/:id
DELETE /candidates/:id
```

Candidate records include identity, headline, about, skills, education, location, preferred work mode, preferred roles, availability, portfolio/GitHub URLs, experience, projects, and profile media URLs.

Example create body:

```json
{
  "name": "Maya Patel",
  "headline": "Frontend engineer",
  "about": "I build accessible product experiences.",
  "skills": ["React", "TypeScript"],
  "education": "B.Tech in Computer Science",
  "location": "Bengaluru, India",
  "preferredWorkMode": "HYBRID",
  "preferredRoles": ["Frontend Engineer"],
  "availability": "IMMEDIATELY",
  "portfolioUrl": "https://example.com",
  "githubUrl": "https://github.com/example"
}
```

## Companies

```text
GET    /companies
GET    /companies/:id
POST   /companies
PUT    /companies/:id
DELETE /companies/:id
```

## Opportunities

```text
GET    /opportunities?candidateId=&companyId=&status=
GET    /opportunities/:id
POST   /opportunities
PUT    /opportunities/:id
DELETE /opportunities/:id
PATCH  /opportunities/:id/accept
PATCH  /opportunities/:id/decline
```

Opportunity statuses are:

```text
PENDING
ACCEPTED
DECLINED
```

Only pending opportunities can be answered or edited.

## Candidate community

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

Post types:

```text
TEXT
PROJECT
VIDEO
```

Create a text post:

```json
{
  "authorId": "candidate-1",
  "type": "TEXT",
  "content": "Sharing a lesson from this week's project."
}
```

Create a project post:

```json
{
  "authorId": "candidate-1",
  "type": "PROJECT",
  "content": "Here is what I am building next.",
  "projectTitle": "Workflow builder",
  "projectStatus": "CURRENT",
  "projectUrl": "https://example.com/project"
}
```

Add a comment:

```json
{
  "candidateId": "candidate-2",
  "body": "This is a useful approach."
}
```

Toggle a reaction:

```json
{
  "candidateId": "candidate-2",
  "type": "INSIGHTFUL"
}
```

Supported reaction types are `LIKE`, `CELEBRATE`, and `INSIGHTFUL`.

## Demo identity

There is no authentication in the current MVP. The frontend passes the active demo candidate ID for social actions and the active demo company ID for opportunity actions. These IDs should be replaced with authenticated user identity before production use.

