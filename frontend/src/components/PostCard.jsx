import { useState } from "react";
import { Link } from "react-router-dom";
import { api, formatApiError } from "../services/api";
import { CommentList } from "./CommentList";

const typeLabels = {
  TEXT: "Thought",
  PROJECT: "Project update",
  VIDEO: "Video update",
};

const reactionLabels = {
  LIKE: "Like",
  INSIGHTFUL: "Insightful",
  CELEBRATE: "Celebrate",
};

export function PostCard({
  post,
  viewerId,
  isOwn = false,
  canInteract = true,
  onChanged,
  onDeleted,
}) {
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(post.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const react = async (type) => {
    setBusy(true);
    setError("");
    try {
      const updated = await api.posts.toggleReaction(post.id, { candidateId: viewerId, type });
      onChanged?.(updated);
    } catch (reactionError) {
      setError(formatApiError(reactionError));
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    if (!editingContent.trim()) return;
    setBusy(true);
    setError("");
    try {
      const updated = await api.posts.update(post.id, {
        actorId: viewerId,
        type: post.type,
        content: editingContent.trim(),
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        projectTitle: post.projectTitle,
        projectStatus: post.projectStatus,
        projectUrl: post.projectUrl,
      });
      setEditing(false);
      onChanged?.(updated);
    } catch (editError) {
      setError(formatApiError(editError));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this update?")) return;
    setBusy(true);
    setError("");
    try {
      await api.posts.remove(post.id, viewerId);
      onDeleted?.(post.id);
    } catch (deleteError) {
      setError(formatApiError(deleteError));
    } finally {
      setBusy(false);
    }
  };

  const countReaction = (type) =>
    (post.reactions || []).filter((reaction) => reaction.type === type).length;

  return (
    <article className="post-card">
      <div className="post-card-header">
        <Link className="post-author" to={`/candidates/${post.authorId}`}>
          <div className="avatar avatar-blue">
            {post.author?.name?.charAt(0) || "?"}
          </div>
          <div>
            <strong>{post.author?.name || "Candidate"}</strong>
            <span>{post.author?.headline || "Professional update"}</span>
            <small>{formatPostDate(post.createdAt)} · {typeLabels[post.type]}</small>
          </div>
        </Link>
        {isOwn && (
          <div className="post-owner-actions">
            <button className="post-action-button" onClick={() => setEditing((current) => !current)}>
              {editing ? "Cancel" : "Edit"}
            </button>
            <button className="post-action-button danger-text" onClick={remove} disabled={busy}>
              Delete
            </button>
          </div>
        )}
      </div>
      {editing ? (
        <div className="post-edit-box">
          <textarea
            className="text-input text-area"
            value={editingContent}
            onChange={(event) => setEditingContent(event.target.value)}
            rows="4"
          />
          <button className="button button-primary button-small" onClick={saveEdit} disabled={busy}>
            {busy ? "Saving..." : "Save update"}
          </button>
        </div>
      ) : (
        <p className="post-content">{post.content}</p>
      )}
      {post.type === "PROJECT" && (
        <div className="post-project-preview">
          <div className="project-preview-icon">✦</div>
          <div>
            <span className="eyebrow">Project · {formatProjectStatus(post.projectStatus)}</span>
            <strong>{post.projectTitle}</strong>
            {post.projectUrl && (
              <a href={post.projectUrl} target="_blank" rel="noreferrer">Open project ↗</a>
            )}
          </div>
        </div>
      )}
      {post.type === "VIDEO" && post.mediaUrl && (
        <a className="post-media-preview" href={post.mediaUrl} target="_blank" rel="noreferrer">
          <span className="video-play">▶</span>
          <span><strong>Watch video update</strong><small>Opens the hosted video in a new tab ↗</small></span>
        </a>
      )}
      {error && <div className="inline-error">{error}</div>}
      <div className="post-stats">
        <span>{post.reactionCount || 0} reactions</span>
        <span>{post.commentCount || 0} comments</span>
      </div>
      {canInteract ? (
        <div className="post-actions">
          {Object.entries(reactionLabels).map(([type, label]) => (
            <button
              className={post.viewerReaction === type ? "post-reaction active" : "post-reaction"}
              onClick={() => react(type)}
              disabled={busy}
              key={type}
            >
              {type === "LIKE" ? "♡" : type === "INSIGHTFUL" ? "✦" : "✹"} {label}
              {countReaction(type) > 0 && <span>{countReaction(type)}</span>}
            </button>
          ))}
          <button className="post-reaction" onClick={() => setShowComments((current) => !current)}>
            ◌ Comment
          </button>
        </div>
      ) : (
        <div className="post-reaction-summary">
          {countReaction("LIKE") > 0 && <span>♡ {countReaction("LIKE")} Likes</span>}
          {countReaction("INSIGHTFUL") > 0 && <span>✦ {countReaction("INSIGHTFUL")} Insightful</span>}
          {countReaction("CELEBRATE") > 0 && <span>✹ {countReaction("CELEBRATE")} Celebrations</span>}
        </div>
      )}
      {(showComments || !canInteract) && (
        <CommentList post={post} candidateId={viewerId} onUpdated={onChanged} readOnly={!canInteract} />
      )}
    </article>
  );
}

function formatPostDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatProjectStatus(value) {
  return {
    CURRENT: "Currently building",
    UPCOMING: "Coming soon",
    COMPLETED: "Completed",
  }[value] || value;
}
