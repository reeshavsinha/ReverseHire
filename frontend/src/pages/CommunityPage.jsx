import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function CommunityPage() {
  const { role, candidateId } = useDemo();
  const [filter, setFilter] = useState("ALL");
  const profile = useFetch(() => api.candidates.get(candidateId), [candidateId]);
  const posts = useFetch(
    () =>
      api.posts.list({
        viewerId: candidateId,
        type: filter === "ALL" ? "" : filter,
      }),
    [candidateId, filter],
  );

  if (role !== "candidate") return <Navigate to="/company/dashboard" replace />;

  return (
    <div className="container page-container">
      <PageHeader
        eyebrow="Candidate community"
        title="A professional network with more signal."
        description="Share what you are building, learn from other candidates, and make your work easier to discover."
        action={<Link className="button button-secondary" to="/candidate/profile">View my profile</Link>}
      />
      <div className="community-layout">
        <div className="community-main">
          <PostComposer candidateId={candidateId} onCreated={posts.reload} />
          <div className="feed-tabs" role="tablist" aria-label="Community feed filters">
            {[
              ["ALL", "All updates"],
              ["PROJECT", "Projects"],
              ["VIDEO", "Videos"],
            ].map(([value, label]) => (
              <button
                className={filter === value ? "feed-tab active" : "feed-tab"}
                onClick={() => setFilter(value)}
                role="tab"
                aria-selected={filter === value}
                key={value}
              >
                {label}
              </button>
            ))}
          </div>
          {posts.loading && <LoadingState label="Loading community updates..." />}
          {posts.error && <ErrorState message={formatApiError(posts.error)} onRetry={posts.reload} />}
          {!posts.loading && !posts.error && !posts.data?.length && (
            <EmptyState
              title="No updates in this view"
              message="Try another filter or be the first to share an update."
            />
          )}
          {!posts.loading && !posts.error && posts.data?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              viewerId={candidateId}
              isOwn={post.authorId === candidateId}
              onChanged={posts.reload}
              onDeleted={posts.reload}
            />
          ))}
        </div>
        <aside className="community-sidebar">
          {profile.loading && <LoadingState label="Loading profile..." />}
          {profile.data && (
            <section className="community-profile-card">
              <div className="community-profile-top">
                <div className="avatar avatar-large avatar-blue">{profile.data.name.charAt(0)}</div>
                <div><span className="eyebrow">Your presence</span><strong>{profile.data.headline}</strong></div>
              </div>
              <h3>{profile.data.name}</h3>
              <p>{profile.data.location} · {profile.data.preferredWorkMode.toLowerCase()}</p>
              <Link className="button button-primary button-small" to="/candidate/profile">Open my profile</Link>
            </section>
          )}
          <section className="community-tip">
            <p className="eyebrow">Community note</p>
            <p>Professional updates work best when they show your thinking, not just the final result. Share a lesson, a useful detail, or what you are trying next.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
