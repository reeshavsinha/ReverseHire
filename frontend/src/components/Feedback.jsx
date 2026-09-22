export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="feedback-card" role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">○</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message = "We could not load this page.", onRetry }) {
  return (
    <div className="error-state" role="alert">
      <strong>Something went wrong.</strong>
      <span>{message}</span>
      {onRetry && (
        <button className="button button-secondary button-small" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
