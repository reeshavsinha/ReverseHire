import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { formatAvailability, formatWorkMode } from "../components/ProfileCard";
import { PageHeader } from "../components/PageHeader";
import { PostCard } from "../components/PostCard";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function CandidateProfilePage() {
  const { id } = useParams();
  const { role, candidateId } = useDemo();
  const profileId = id || candidateId;
  const isOwn = profileId === candidateId && role === "candidate";
  const viewerId = role === "candidate" ? candidateId : "";
  const [activeTab, setActiveTab] = useState("overview");
  const profile = useFetch(() => api.candidates.get(profileId), [profileId]);
  const posts = useFetch(
    () => api.posts.list(isOwn ? { viewerId } : { authorId: profileId, viewerId }),
    [profileId, viewerId, isOwn],
  );

  const activityPosts = useMemo(() => {
    const records = posts.data || [];
    if (!isOwn) return records;
    return records.filter(
      (post) =>
        post.authorId === profileId ||
        post.comments?.some((comment) => comment.authorId === profileId) ||
        post.reactions?.some((reaction) => reaction.candidateId === profileId),
    );
  }, [posts.data, isOwn, profileId]);

  if (profile.loading) return <div className="container page-container"><LoadingState label="Loading profile..." /></div>;
  if (profile.error) return <div className="container page-container"><ErrorState message={formatApiError(profile.error)} onRetry={profile.reload} /></div>;
  if (!profile.data) return <div className="container page-container"><EmptyState title="Profile not found" message="This profile may have been removed." /></div>;

  const candidate = profile.data;
  const backPath = role === "company" ? "/discover" : "/community";

  return (
    <div className="container page-container">
      <Link to={backPath} className="back-link">← Back to {role === "company" ? "discover candidates" : "community"}</Link>
      <section className="social-profile-hero">
        <div className="profile-cover">
          {candidate.coverPhotoUrl ? <img src={candidate.coverPhotoUrl} alt="" /> : <div className="profile-cover-pattern" />}
        </div>
        <div className="social-profile-header">
          <div className="social-profile-heading">
            <div className="avatar avatar-large avatar-blue">{candidate.name.charAt(0)}</div>
            <div>
              <p className="eyebrow">{isOwn ? "Your professional profile" : "Candidate profile"}</p>
              <h1>{candidate.name}</h1>
              <p className="profile-headline">{candidate.headline}</p>
              <div className="meta-row"><span>⌖ {candidate.location}</span><span>◷ {formatWorkMode(candidate.preferredWorkMode)} work</span><span>● {formatAvailability(candidate.availability)}</span>{candidate.pronouns && <span>{candidate.pronouns}</span>}</div>
            </div>
          </div>
          <div className="profile-hero-action">
            {isOwn ? <Link className="button button-primary" to="/candidate/edit">Edit profile</Link> : <a className="button button-primary" href={`mailto:?subject=Opportunity for ${candidate.name}`}>Start a conversation</a>}
          </div>
        </div>
        <div className="profile-tabs">
          <button className={activeTab === "overview" ? "profile-tab active" : "profile-tab"} onClick={() => setActiveTab("overview")}>Overview</button>
          <button className={activeTab === "activity" ? "profile-tab active" : "profile-tab"} onClick={() => setActiveTab("activity")}>Activity <span>{activityPosts.length}</span></button>
          <button className={activeTab === "projects" ? "profile-tab active" : "profile-tab"} onClick={() => setActiveTab("projects")}>Projects <span>{candidate.projects?.length || 0}</span></button>
        </div>
      </section>

      {(activeTab === "overview" || activeTab === "projects") && (
        <div className="detail-grid social-profile-grid">
          <div className="detail-main">
            {activeTab === "overview" && (
              <>
                <section className="detail-card"><p className="eyebrow">About</p><h2>A little about {candidate.name.split(" ")[0]}</h2><p className="long-copy">{candidate.about}</p></section>
                <section className="detail-card"><p className="eyebrow">Experience</p><div className="experience-list">{(candidate.experience || []).map((item) => <div className="experience-item" key={item.id}><div className="experience-marker" /><div><h3>{item.title}</h3><p className="experience-company">{item.company} · {formatDateRange(item.startDate, item.endDate)}</p><p className="experience-description">{item.description}</p></div></div>)}</div></section>
                <section className="detail-card"><p className="eyebrow">What they are looking for</p><div className="preference-list"><div><span className="preference-icon">✦</span><div><strong>Preferred roles</strong><p>{candidate.preferredRoles.join(" · ")}</p></div></div><div><span className="preference-icon">⌖</span><div><strong>Preferred work mode</strong><p>{formatWorkMode(candidate.preferredWorkMode)}</p></div></div><div><span className="preference-icon">◷</span><div><strong>Availability</strong><p>{formatAvailability(candidate.availability)}</p></div></div></div></section>
              </>
            )}
            {activeTab === "projects" && <ProjectList projects={candidate.projects || []} />}
          </div>
          <ProfileSidebar candidate={candidate} />
        </div>
      )}

      {activeTab === "activity" && (
        <section className="activity-section">
          <div className="section-heading-row"><div><p className="eyebrow">{isOwn ? "Your activity" : "Recent activity"}</p><h2>{isOwn ? "Posts, projects, and conversations" : "What they are sharing"}</h2></div></div>
          {posts.loading && <LoadingState label="Loading activity..." />}
          {posts.error && <ErrorState message={formatApiError(posts.error)} onRetry={posts.reload} />}
          {!posts.loading && !posts.error && !activityPosts.length && <EmptyState title="No activity yet" message="Updates and project notes will appear here." />}
          {!posts.loading && !posts.error && <div className="post-list">{activityPosts.map((post) => <PostCard key={post.id} post={post} viewerId={viewerId} isOwn={isOwn && post.authorId === candidateId} canInteract={role === "candidate"} onChanged={posts.reload} onDeleted={posts.reload} />)}</div>}
        </section>
      )}
    </div>
  );
}

function ProfileSidebar({ candidate }) {
  return (
    <aside className="detail-sidebar">
      <section className="detail-card"><p className="eyebrow">Skills</p><div className="tag-row tag-row-large">{candidate.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></section>
      <section className="detail-card"><p className="eyebrow">Education</p><p className="sidebar-value">{candidate.education}</p></section>
      <section className="detail-card"><p className="eyebrow">Elsewhere</p><div className="external-links">{candidate.portfolioUrl && <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer">Portfolio ↗</a>}{candidate.githubUrl && <a href={candidate.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}</div></section>
    </aside>
  );
}

function ProjectList({ projects }) {
  if (!projects.length) return <EmptyState title="No projects added yet" message="Projects will appear here when this profile is updated." />;
  return <section className="detail-card project-list-card"><p className="eyebrow">Selected projects</p><div className="project-list">{projects.map((project) => <article className="project-card" key={project.id}><div className="project-card-top"><span className="project-preview-icon">✦</span><span className="status-badge status-pending">{formatProjectStatus(project.status)}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.techStack.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div>{project.projectUrl && <a className="text-link" href={project.projectUrl} target="_blank" rel="noreferrer">View project ↗</a>}</article>)}</div></section>;
}

function formatDateRange(startDate, endDate) {
  const format = (value) => value ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(`${value}-01`)) : "Present";
  return `${format(startDate)} – ${format(endDate)}`;
}

function formatProjectStatus(value) {
  return { CURRENT: "Current", UPCOMING: "Upcoming", COMPLETED: "Completed" }[value] || value;
}
