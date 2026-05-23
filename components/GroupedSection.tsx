interface GroupedSectionProps {
  title: string;
  badge?: string;
  hint?: string;
  hideHeaderOnMobile?: boolean;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function GroupedSection({
  title,
  badge,
  hint,
  hideHeaderOnMobile = false,
  children,
  controls,
}: GroupedSectionProps) {
  return (
    <section className="mb-4 sm:mb-6">
      <div
        className={`section-header mb-2 flex items-start justify-between gap-2 px-0.5 sm:mb-3 sm:gap-3 sm:px-1 ${
          hideHeaderOnMobile ? "hidden md:flex" : ""
        }`}
      >
        <div className="min-w-0 flex-1">
          <h2 className="apple-heading-3">{title}</h2>
          {hint ? <p className="apple-footnote mt-0.5 hidden md:block">{hint}</p> : null}
        </div>
        {badge ? <span className="badge-pill shrink-0">{badge}</span> : null}
      </div>
      {controls ? <div className="mb-2.5 px-0.5 sm:mb-3 sm:px-1">{controls}</div> : null}
      <div className="surface-grouped">{children}</div>
    </section>
  );
}
