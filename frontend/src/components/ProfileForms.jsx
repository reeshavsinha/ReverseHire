import { FormField, SelectInput, TextArea, TextInput } from "./FormField";

export const candidateDefaults = {
  name: "",
  headline: "",
  about: "",
  skills: "",
  education: "",
  location: "",
  preferredWorkMode: "REMOTE",
  preferredRoles: "",
  availability: "IMMEDIATELY",
  portfolioUrl: "",
  githubUrl: "",
  profilePhotoUrl: "",
  coverPhotoUrl: "",
  pronouns: "",
  experience: [],
  projects: [],
  featuredPostIds: [],
};

export function toCandidatePayload(values) {
  return {
    ...values,
    skills: toStringList(values.skills),
    preferredRoles: toStringList(values.preferredRoles),
    experience: (values.experience || [])
      .filter((item) => item.title || item.company || item.description)
      .map((item) => ({
        ...item,
        techStack: undefined,
      })),
    projects: (values.projects || [])
      .filter((item) => item.title || item.description)
      .map((item) => ({
        ...item,
        techStack: toStringList(item.techStack),
      })),
  };
}

function toStringList(value) {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  return typeof value === "string" ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

export function CandidateForm({ values, onChange, onSubmit, submitting, submitLabel, error }) {
  const update = (event) => onChange({ ...values, [event.target.name]: event.target.value });
  const updateExperience = (index, field, value) => {
    const experience = [...(values.experience || [])];
    experience[index] = { ...experience[index], [field]: value };
    onChange({ ...values, experience });
  };
  const updateProject = (index, field, value) => {
    const projects = [...(values.projects || [])];
    projects[index] = { ...projects[index], [field]: value };
    onChange({ ...values, projects });
  };
  const addExperience = () => onChange({
    ...values,
    experience: [...(values.experience || []), { title: "", company: "", startDate: "", endDate: "", description: "" }],
  });
  const addProject = () => onChange({
    ...values,
    projects: [...(values.projects || []), { title: "", description: "", status: "CURRENT", techStack: "", projectUrl: "", mediaUrl: "" }],
  });

  return (
    <form className="form-card" onSubmit={onSubmit}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-section">
        <div className="form-section-heading"><h2>About you</h2><p>Help companies understand who you are beyond a job title.</p></div>
        <div className="form-grid">
          <TextInput label="Name" name="name" value={values.name} onChange={update} placeholder="Your full name" required />
          <TextInput label="Headline" name="headline" value={values.headline} onChange={update} placeholder="What do you do best?" required />
          <TextArea label="About" name="about" value={values.about} onChange={update} placeholder="Tell companies about your experience, interests, and what you care about." rows="5" required />
          <TextInput label="Education" name="education" value={values.education} onChange={update} placeholder="Degree, school, or equivalent experience" required />
          <TextInput label="Pronouns" name="pronouns" value={values.pronouns || ""} onChange={update} placeholder="she/her" />
          <TextInput label="Profile photo URL" type="url" name="profilePhotoUrl" value={values.profilePhotoUrl || ""} onChange={update} placeholder="https://..." />
          <TextInput label="Cover photo URL" type="url" name="coverPhotoUrl" value={values.coverPhotoUrl || ""} onChange={update} placeholder="https://..." />
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-heading"><h2>What you are looking for</h2><p>Be clear about the opportunities that would make you curious.</p></div>
        <div className="form-grid">
          <TextInput label="Skills" hint="Separate skills with commas" name="skills" value={values.skills} onChange={update} placeholder="React, TypeScript, Product thinking" required />
          <TextInput label="Preferred roles" hint="Separate roles with commas" name="preferredRoles" value={values.preferredRoles} onChange={update} placeholder="Frontend Engineer, Product Engineer" required />
          <TextInput label="Location" name="location" value={values.location} onChange={update} placeholder="City, country" required />
          <SelectInput label="Preferred work mode" name="preferredWorkMode" value={values.preferredWorkMode} onChange={update}><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></SelectInput>
          <SelectInput label="Availability" name="availability" value={values.availability} onChange={update}><option value="IMMEDIATELY">Available immediately</option><option value="ONE_MONTH">Available in one month</option><option value="THREE_MONTHS">Available in three months</option><option value="NOT_LOOKING">Not currently looking</option></SelectInput>
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-heading form-section-heading-row"><div><h2>Experience</h2><p>Give your profile a sense of the work behind the headline.</p></div><button type="button" className="button button-secondary button-small" onClick={addExperience}>Add experience</button></div>
        <div className="dynamic-form-list">
          {(values.experience || []).map((item, index) => <div className="dynamic-form-card" key={item.id || index}><div className="dynamic-form-card-heading"><strong>Experience {index + 1}</strong><button type="button" className="remove-link" onClick={() => onChange({ ...values, experience: values.experience.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button></div><div className="form-grid"><TextInput label="Title" value={item.title} onChange={(event) => updateExperience(index, "title", event.target.value)} placeholder="Frontend Engineer" required /><TextInput label="Company" value={item.company} onChange={(event) => updateExperience(index, "company", event.target.value)} placeholder="Company name" required /><TextInput label="Start date" type="month" value={item.startDate} onChange={(event) => updateExperience(index, "startDate", event.target.value)} /><TextInput label="End date" hint="Leave blank for current role" type="month" value={item.endDate} onChange={(event) => updateExperience(index, "endDate", event.target.value)} /><TextArea label="Description" value={item.description} onChange={(event) => updateExperience(index, "description", event.target.value)} placeholder="What did you own or change?" rows="3" required /></div></div>)}
          {!values.experience?.length && <p className="form-empty-note">No experience added yet. Add one role to make your profile more complete.</p>}
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-heading form-section-heading-row"><div><h2>Projects</h2><p>Show what you are building now, next, and what you have shipped.</p></div><button type="button" className="button button-secondary button-small" onClick={addProject}>Add project</button></div>
        <div className="dynamic-form-list">
          {(values.projects || []).map((item, index) => <div className="dynamic-form-card" key={item.id || index}><div className="dynamic-form-card-heading"><strong>Project {index + 1}</strong><button type="button" className="remove-link" onClick={() => onChange({ ...values, projects: values.projects.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button></div><div className="form-grid"><TextInput label="Project name" value={item.title} onChange={(event) => updateProject(index, "title", event.target.value)} placeholder="What are you building?" required /><SelectInput label="Status" value={item.status} onChange={(event) => updateProject(index, "status", event.target.value)}><option value="CURRENT">Currently building</option><option value="UPCOMING">Coming soon</option><option value="COMPLETED">Completed</option></SelectInput><TextArea label="Description" value={item.description} onChange={(event) => updateProject(index, "description", event.target.value)} placeholder="What is it and why does it matter?" rows="3" required /><TextInput label="Tech stack" hint="Separate with commas" value={item.techStack || ""} onChange={(event) => updateProject(index, "techStack", event.target.value)} placeholder="React, Node.js" /><TextInput label="Project URL" type="url" value={item.projectUrl || ""} onChange={(event) => updateProject(index, "projectUrl", event.target.value)} placeholder="https://..." /><TextInput label="Media URL" hint="Optional hosted image/video" type="url" value={item.mediaUrl || ""} onChange={(event) => updateProject(index, "mediaUrl", event.target.value)} placeholder="https://..." /></div></div>)}
          {!values.projects?.length && <p className="form-empty-note">No projects added yet. Add a current or upcoming project to your profile.</p>}
        </div>
      </div>
      <div className="form-section"><div className="form-section-heading"><h2>Links</h2><p>Give people a place to see your work.</p></div><div className="form-grid"><TextInput label="Portfolio URL" type="url" name="portfolioUrl" value={values.portfolioUrl} onChange={update} placeholder="https://yourportfolio.com" /><TextInput label="GitHub URL" type="url" name="githubUrl" value={values.githubUrl} onChange={update} placeholder="https://github.com/you" /></div></div>
      <div className="form-actions"><button type="submit" className="button button-primary" disabled={submitting}>{submitting ? "Saving..." : submitLabel}</button></div>
    </form>
  );
}

export const companyDefaults = {
  name: "",
  description: "",
  industry: "",
  location: "",
  website: "",
  companySize: "11-50",
};

export function CompanyForm({ values, onChange, onSubmit, submitting, submitLabel, error }) {
  const update = (event) => onChange({ ...values, [event.target.name]: event.target.value });
  return (
    <form className="form-card" onSubmit={onSubmit}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-section"><div className="form-section-heading"><h2>Company details</h2><p>Tell candidates what makes your team worth discovering.</p></div><div className="form-grid"><TextInput label="Company name" name="name" value={values.name} onChange={update} placeholder="Northstar Labs" required /><TextInput label="Industry" name="industry" value={values.industry} onChange={update} placeholder="Developer tools" required /><TextInput label="Location" name="location" value={values.location} onChange={update} placeholder="City, country" required /><SelectInput label="Company size" name="companySize" value={values.companySize} onChange={update}><option value="1-10">1–10 people</option><option value="11-50">11–50 people</option><option value="51-200">51–200 people</option><option value="201-500">201–500 people</option><option value="500+">500+ people</option></SelectInput><TextArea label="Description" name="description" value={values.description} onChange={update} placeholder="What are you building and why does it matter?" rows="6" required /><TextInput label="Website" type="url" name="website" value={values.website} onChange={update} placeholder="https://yourcompany.com" /></div></div>
      <div className="form-actions"><button type="submit" className="button button-primary" disabled={submitting}>{submitting ? "Saving..." : submitLabel}</button></div>
    </form>
  );
}
