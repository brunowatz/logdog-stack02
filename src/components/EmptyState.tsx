'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={action.onClick}
          style={{ marginTop: 16 }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
