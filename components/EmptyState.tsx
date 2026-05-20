import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { href: string; label: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="font-medium text-[var(--label-primary)]">{title}</p>
      <p className="tahoe-footnote mt-1">{description}</p>
      {action ? (
        <Link className="btn-glass-prominent mt-4 inline-flex" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
