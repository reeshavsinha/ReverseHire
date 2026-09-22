# Data Models

The current data store uses plain JavaScript objects. These shapes are intentionally close to the Mongoose schemas planned for the MongoDB version.

## Candidate

```text
id
name
headline
about
skills[]
education
location
preferredWorkMode: REMOTE | HYBRID | ONSITE
preferredRoles[]
availability: IMMEDIATELY | ONE_MONTH | THREE_MONTHS | NOT_LOOKING
portfolioUrl
githubUrl
profilePhotoUrl
coverPhotoUrl
pronouns
experience[]
projects[]
featuredPostIds[]
createdAt
updatedAt
```

Experience entries:

```text
id
title
company
startDate
endDate
description
```

Project entries:

```text
id
title
description
status: CURRENT | UPCOMING | COMPLETED
techStack[]
projectUrl
mediaUrl
```

## Company

```text
id
name
description
industry
location
website
companySize: 1-10 | 11-50 | 51-200 | 201-500 | 500+
createdAt
updatedAt
```

## Opportunity

```text
id
candidate
company
roleTitle
description
location
workMode: REMOTE | HYBRID | ONSITE
compensation
message
status: PENDING | ACCEPTED | DECLINED
respondedAt
createdAt
updatedAt
```

Candidate and company references are currently string IDs. They will become MongoDB `ObjectId` references during migration.

## Post

```text
id
authorId
type: TEXT | PROJECT | VIDEO
content
mediaUrl
mediaType: IMAGE | VIDEO
projectTitle
projectStatus: CURRENT | UPCOMING | COMPLETED
projectUrl
comments[]
reactions[]
createdAt
updatedAt
```

Embedded comment:

```text
id
authorId
body
createdAt
```

Embedded reaction:

```text
candidateId
type: LIKE | CELEBRATE | INSIGHTFUL
```

Comments and reactions are embedded for MVP simplicity. If the platform grows substantially, they can be split into separate MongoDB collections for indexing and pagination.

