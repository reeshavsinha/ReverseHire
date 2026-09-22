const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isArrayOfStrings = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => isNonEmptyString(item));

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const isUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const requireFields = (body, fields) =>
  fields
    .filter((field) => !isNonEmptyString(body[field]))
    .map((field) => `${field} is required`);

export function validateCandidate(body) {
  const errors = requireFields(body, [
    "name",
    "headline",
    "about",
    "education",
    "location",
  ]);

  if (!isArrayOfStrings(body.skills)) errors.push("skills must be a non-empty list");
  if (!isArrayOfStrings(body.preferredRoles)) {
    errors.push("preferredRoles must be a non-empty list");
  }
  if (!["REMOTE", "HYBRID", "ONSITE"].includes(body.preferredWorkMode)) {
    errors.push("preferredWorkMode must be REMOTE, HYBRID, or ONSITE");
  }
  if (
    !["IMMEDIATELY", "ONE_MONTH", "THREE_MONTHS", "NOT_LOOKING"].includes(
      body.availability,
    )
  ) {
    errors.push("availability is invalid");
  }
  if (!isUrl(body.portfolioUrl) || !isUrl(body.githubUrl)) {
    errors.push("portfolioUrl and githubUrl must be valid http(s) URLs");
  }
  if (!isUrl(body.profilePhotoUrl) || !isUrl(body.coverPhotoUrl)) {
    errors.push("profilePhotoUrl and coverPhotoUrl must be valid http(s) URLs");
  }
  const experience = body.experience ?? [];
  const projects = body.projects ?? [];
  if (
    !Array.isArray(experience) ||
    experience.some(
      (item) =>
        !isObject(item) ||
        !isNonEmptyString(item.title) ||
        !isNonEmptyString(item.company) ||
        !isNonEmptyString(item.description),
    )
  ) {
    errors.push("experience must contain valid title, company, and description entries");
  }
  if (
    !Array.isArray(projects) ||
    projects.some(
      (item) =>
        !isObject(item) ||
        !isNonEmptyString(item.title) ||
        !isNonEmptyString(item.description) ||
        !["CURRENT", "UPCOMING", "COMPLETED"].includes(item.status) ||
        !Array.isArray(item.techStack),
    )
  ) {
    errors.push("projects must contain valid title, description, status, and techStack entries");
  }
  if (
    !projects.every(
      (item) => isUrl(item.projectUrl) && isUrl(item.mediaUrl),
    )
  ) {
    errors.push("projectUrl and mediaUrl must be valid http(s) URLs");
  }

  return errors;
}

export function validateCompany(body) {
  const errors = requireFields(body, [
    "name",
    "description",
    "industry",
    "location",
  ]);

  if (!["1-10", "11-50", "51-200", "201-500", "500+"].includes(body.companySize)) {
    errors.push("companySize is invalid");
  }
  if (!isUrl(body.website)) {
    errors.push("website must be a valid http(s) URL");
  }

  return errors;
}

export function validateOpportunity(body) {
  const errors = requireFields(body, [
    "candidate",
    "company",
    "roleTitle",
    "description",
    "location",
    "compensation",
    "message",
  ]);

  if (!["REMOTE", "HYBRID", "ONSITE"].includes(body.workMode)) {
    errors.push("workMode must be REMOTE, HYBRID, or ONSITE");
  }

  return errors;
}

export function validatePost(body) {
  const errors = requireFields(body, ["authorId", "content"]);

  if (!["TEXT", "PROJECT", "VIDEO"].includes(body.type)) {
    errors.push("type must be TEXT, PROJECT, or VIDEO");
  }
  if (!isUrl(body.mediaUrl) || !isUrl(body.projectUrl)) {
    errors.push("mediaUrl and projectUrl must be valid http(s) URLs");
  }
  if (body.mediaType && !["IMAGE", "VIDEO"].includes(body.mediaType)) {
    errors.push("mediaType must be IMAGE or VIDEO");
  }
  if (
    body.type === "PROJECT" &&
    (!isNonEmptyString(body.projectTitle) ||
      !["CURRENT", "UPCOMING", "COMPLETED"].includes(body.projectStatus))
  ) {
    errors.push("project posts require a projectTitle and valid projectStatus");
  }
  if (body.type === "VIDEO" && !isNonEmptyString(body.mediaUrl)) {
    errors.push("video posts require a mediaUrl");
  }

  return errors;
}

export function validateComment(body) {
  return requireFields(body, ["candidateId", "body"]);
}

export const cleanString = (value) =>
  typeof value === "string" ? value.trim() : value;

export const cleanStringList = (value) =>
  Array.isArray(value)
    ? value.map((item) => cleanString(item)).filter(Boolean)
    : value;

export const cleanExperience = (value) =>
  Array.isArray(value)
    ? value.map((item) => ({
        id: cleanString(item.id),
        title: cleanString(item.title),
        company: cleanString(item.company),
        startDate: cleanString(item.startDate),
        endDate: cleanString(item.endDate),
        description: cleanString(item.description),
      }))
    : value;

export const cleanProjects = (value) =>
  Array.isArray(value)
    ? value.map((item) => ({
        id: cleanString(item.id),
        title: cleanString(item.title),
        description: cleanString(item.description),
        status: cleanString(item.status),
        techStack: cleanStringList(item.techStack),
        projectUrl: cleanString(item.projectUrl),
        mediaUrl: cleanString(item.mediaUrl),
      }))
    : value;
