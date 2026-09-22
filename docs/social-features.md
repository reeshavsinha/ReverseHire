# Candidate Social Features

## Product scope

The social layer is intentionally candidate-only:

- Candidates can create posts.
- Candidates can comment and react.
- Candidates can view community activity and their own activity.
- Companies can view candidate profiles and project activity.
- Companies cannot post, comment, or react in the current MVP.

This keeps the product focused on helping candidates become discoverable while preserving the reverse-recruitment workflow.

## Community feed

The Community page provides:

- All updates
- Project updates
- Video updates
- A post composer
- Reactions
- Comments
- Edit/delete controls for the active candidate's own posts

Post content is stored as text. Video and image media are represented by URLs, which avoids adding an upload provider before the storage architecture is finalized.

## Candidate profile

The candidate profile contains:

- Cover and avatar URLs
- Headline and About section
- Location, work mode, availability, and pronouns
- Experience timeline
- Education
- Skills
- Projects
- Portfolio and GitHub links
- Activity tab

The active candidate's Activity tab includes their own posts plus posts where they have commented or reacted.

## Dashboard behavior

Candidate dashboard:

- Opportunity counts
- Profile summary
- Profile and community shortcuts
- Recent personal activity
- Recent opportunities

Company dashboard:

- Opportunity funnel counts
- Company profile summary
- Candidate discovery shortcut
- Create opportunity shortcut
- Recent outreach

## Future considerations

Before production, the social layer should add:

- Authentication and authorization
- Pagination or cursor-based feed loading
- Rate limiting and abuse controls
- Content moderation/reporting
- Media upload and processing
- Rich link previews
- Notifications

