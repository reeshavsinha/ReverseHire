import { useState } from "react";
import { api, formatApiError } from "../services/api";

const formatCommentDate = (value) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));

export function CommentList({ post, candidateId, onUpdated, readOnly = false }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addComment = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const updated = await api.posts.addComment(post.id, {
        candidateId,
        body: body.trim(),
      });
      setBody("");
      onUpdated?.(updated);
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      const updated = await api.posts.removeComment(post.id, commentId, candidateId);
      onUpdated?.(updated);
    } catch (removeError) {
      setError(formatApiError(removeError));
    }
  };

  return (
    <div className="comments-panel">
      {!readOnly && (
        <form className="comment-form" onSubmit={addComment}>
          <div className="comment-avatar avatar avatar-blue">✦</div>
          <input
            className="text-input"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Add a thoughtful comment..."
            aria-label="Add a comment"
          />
          <button className="button button-primary button-small" disabled={submitting || !body.trim()}>
            Comment
          </button>
        </form>
      )}
      {error && <div className="inline-error">{error}</div>}
      <div className="comment-list">
        {(post.comments || []).map((comment) => (
          <div className="comment-item" key={comment.id}>
            <div className="comment-avatar avatar avatar-blue">
              {comment.author?.name?.charAt(0) || "?"}
            </div>
            <div className="comment-content">
              <div className="comment-meta">
                <strong>{comment.author?.name || "Candidate"}</strong>
                <span>{formatCommentDate(comment.createdAt)}</span>
                {comment.authorId === candidateId && (
                  <button className="comment-delete" onClick={() => removeComment(comment.id)}>
                    Delete
                  </button>
                )}
              </div>
              <p>{comment.body}</p>
            </div>
          </div>
        ))}
        {!post.comments?.length && <p className="no-comments">Be the first to add a thoughtful response.</p>}
      </div>
    </div>
  );
}
