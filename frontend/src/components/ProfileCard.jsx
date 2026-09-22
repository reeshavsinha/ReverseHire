import { Link } from "react-router-dom";

export function ProfileCard({ candidate }) {
  return (
    <article className="profile-card">
      <div className="avatar avatar-blue">{candidate.name.charAt(0)}</div>
      <div className="profile-card-content">
        <div className="card-heading-row">
          <div>
            <h3>{candidate.name}</h3>
            <p className="card-subtitle">{candidate.headline}</p>
          </div>
          <span className="availability-dot">
            <span />
            {candidate.availability === "IMMEDIATELY" ? "Available now" : "Open to offers"}
          </span>
        </div>
        <div className="meta-row">
          <span>⌖ {candidate.location}</span>
          <span>◷ {formatWorkMode(candidate.preferredWorkMode)}</span>
        </div>
        <div className="tag-row">
          {candidate.skills.slice(0, 4).map((skill) => (
            <span className="tag" key={skill}>{skill}</span>
          ))}
        </div>
        <div className="preferred-role-row">
          <span className="role-label">Open to</span>
          {candidate.preferredRoles.slice(0, 2).map((role) => (
            <span className="role-chip" key={role}>{role}</span>
          ))}
        </div>
        <Link className="text-link card-link" to={`/candidates/${candidate.id}`}>
          View profile <span>→</span>
        </Link>
      </div>
    </article>
  );
}

export function formatWorkMode(value) {
  return value ? value.charAt(0) + value.slice(1).toLowerCase() : "";
}

export function formatAvailability(value) {
  return {
    IMMEDIATELY: "Available immediately",
    ONE_MONTH: "Available in one month",
    THREE_MONTHS: "Available in three months",
    NOT_LOOKING: "Not currently looking",
  }[value] || value;
}
