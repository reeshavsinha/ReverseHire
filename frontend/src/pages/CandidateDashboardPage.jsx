import { Link } from "react-router-dom";
import { OpportunityCard } from "../components/OpportunityCard";
import { PostCard } from "../components/PostCard";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { formatAvailability, formatWorkMode } from "../components/ProfileCard";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";
import { useState } from "react";

export function CandidateDashboardPage() {
  const { candidateId } = useDemo();
  const profile = useFetch(() => api.candidates.get(candidateId), [candidateId]);
  const opportunities = useFetch(() => api.opportunities.list({ candidateId }), [candidateId]);
  const activity = useFetch(() => api.posts.list({ authorId: candidateId, viewerId: candidateId }), [candidateId]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const answer = async (id, action) => {
    setActionLoading(true);
    setActionError("");
    try {
      await api.opportunities[action](id);
      await opportunities.reload();
    } catch (error) {
      setActionError(formatApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const items = opportunities.data || [];
  const stats = [
    ["Total opportunities", items.length, "stat-blue"],
    ["Waiting for you", items.filter((item) => item.status === "PENDING").length, "stat-yellow"],
    ["Accepted", items.filter((item) => item.status === "ACCEPTED").length, "stat-green"],
    ["Declined", items.filter((item) => item.status === "DECLINED").length, "stat-gray"],
  ];

  return (
    <div className="container page-container">
      <PageHeader eyebrow="Candidate workspace" title={`Good to see you, ${profile.data?.name?.split(" ")[0] || "there"}.`} description="Keep your profile fresh, share what you are building, and choose the opportunities that feel worth your time." action={<div className="page-header-actions"><Link className="button button-secondary" to="/community">Open community</Link><Link className="button button-primary" to="/candidate/edit">Edit profile</Link></div>} />
      {profile.loading && <LoadingState label="Loading your profile..." />}
      {profile.error && <ErrorState message={formatApiError(profile.error)} onRetry={profile.reload} />}
      {profile.data && <section className="summary-card"><div className="summary-avatar avatar avatar-blue">{profile.data.name.charAt(0)}</div><div className="summary-content"><div className="summary-top"><div><h2>{profile.data.name}</h2><p>{profile.data.headline}</p></div><Link className="text-link" to={`/candidates/${profile.data.id}`}>View public profile →</Link></div><div className="meta-row"><span>⌖ {profile.data.location}</span><span>◷ {formatWorkMode(profile.data.preferredWorkMode)}</span><span>● {formatAvailability(profile.data.availability)}</span></div><div className="tag-row">{profile.data.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></div></section>}
      <div className="stats-grid dashboard-stats">{stats.map(([label, value, color]) => <div className={`stat-card ${color}`} key={label}><strong>{opportunities.loading ? "—" : value}</strong><span>{label}</span></div>)}</div>
      <section className="dashboard-action-grid"><Link className="dashboard-action-card action-blue" to="/candidate/profile"><span className="action-card-icon">◎</span><div><strong>Shape your profile</strong><p>Add experience, projects, and links so the right companies understand your work.</p></div><span className="action-arrow">→</span></Link><Link className="dashboard-action-card action-beige" to="/community"><span className="action-card-icon">✦</span><div><strong>Share an update</strong><p>Post about a current project, a lesson, or something you are exploring next.</p></div><span className="action-arrow">→</span></Link></section>
      <section className="dashboard-section"><div className="section-heading-row"><div><p className="eyebrow">Your activity</p><h2>What you are sharing</h2></div><Link className="text-link" to="/community">Open community →</Link></div>{activity.loading && <LoadingState label="Loading your activity..." />}{activity.error && <ErrorState message={formatApiError(activity.error)} onRetry={activity.reload} />}{!activity.loading && !activity.error && !activity.data?.length && <EmptyState title="Your activity starts here" message="Share a project or thought with the candidate community." action={<Link className="button button-secondary" to="/community">Write an update</Link>} />}{!activity.loading && !activity.error && activity.data?.length > 0 && <div className="post-list">{activity.data.slice(0, 2).map((post) => <PostCard key={post.id} post={post} viewerId={candidateId} isOwn canInteract onChanged={activity.reload} onDeleted={activity.reload} />)}</div>}</section>
      <section className="dashboard-section"><div className="section-heading-row"><div><p className="eyebrow">Your inbox preview</p><h2>Recent opportunities</h2></div><Link className="text-link" to="/candidate/inbox">See full inbox →</Link></div>{opportunities.loading && <LoadingState label="Loading opportunities..." />}{opportunities.error && <ErrorState message={formatApiError(opportunities.error)} onRetry={opportunities.reload} />}{actionError && <div className="form-error">{actionError}</div>}{!opportunities.loading && !opportunities.error && items.length === 0 && <EmptyState title="Your inbox is quiet" message="Once a company finds your profile, opportunities will show up here." action={<Link className="button button-secondary" to="/discover">Explore the network</Link>} />}{!opportunities.loading && items.length > 0 && <div className="opportunity-list">{items.slice(0, 3).map((item) => <OpportunityCard key={item.id} opportunity={item} onAccept={(id) => answer(id, "accept")} onDecline={(id) => answer(id, "decline")} actionLoading={actionLoading} />)}</div>}</section>
    </div>
  );
}
