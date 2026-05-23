import { formatPercent } from "@/lib/format";

interface TodaySummaryProps {
  completed: number;
  total: number;
}

export function TodaySummary({ completed, total }: TodaySummaryProps) {
  const percent = formatPercent(completed, total);
  const allDone = total > 0 && completed === total;

  return (
    <div className="today-summary">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--label-primary)]">
          {allDone ? "All done" : `${completed}/${total}`}
          {total > 0 ? (
            <span className="font-normal text-[var(--label-secondary)]"> · {percent}%</span>
          ) : null}
        </p>
        <div aria-hidden className="progress-ring hidden sm:grid">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 56 56">
            <circle
              className="progress-ring-track"
              cx="28"
              cy="28"
              fill="none"
              r="24"
              strokeWidth="4"
            />
            <circle
              className="progress-ring-fill"
              cx="28"
              cy="28"
              fill="none"
              r="24"
              strokeDasharray={`${(percent / 100) * 150.8} 150.8`}
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          <span className="progress-ring-label">{total === 0 ? "—" : `${percent}%`}</span>
        </div>
      </div>
      <div aria-hidden className="progress-bar mt-2 sm:mt-3">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
