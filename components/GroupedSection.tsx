interface GroupedSectionProps {
  title: string;
  badge?: string;
  hint?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function GroupedSection({ title, badge, hint, children, controls }: GroupedSectionProps) {
  return (
    <section className="mb-5 sm:mb-6">
      <div className="section-header mb-2.5 flex items-start justify-between gap-2 px-0.5 sm:mb-3 sm:gap-3 sm:px-1">
        <div className="min-w-0 flex-1">
          <h2 className="tahoe-title-3 text-[var(--label-primary)]">{title}</h2>
          {hint ? <p className="tahoe-footnote mt-0.5">{hint}</p> : null}
        </div>
        {badge ? <span className="badge-glass shrink-0">{badge}</span> : null}
      </div>
      {controls ? <div className="mb-2.5 px-0.5 sm:mb-3 sm:px-1">{controls}</div> : null}
      <div className="surface-grouped">{children}</div>
    </section>
  );
}
