import Link from "next/link";
import { addDays, daysBeforeToday } from "@/lib/dates";

interface DateNavigatorProps {
  selectedDate: string;
  calendarToday: string;
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M14.5 6.5 9 12l5.5 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m9.5 6.5 5.5 5.5-5.5 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function formatDateParts(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    long: date.toLocaleDateString("en", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    short: date.toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    compact: date.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function getRelativeHint(selectedDate: string, calendarToday: string) {
  const daysAgo = daysBeforeToday(selectedDate, calendarToday);

  if (daysAgo <= 0) {
    return null;
  }

  if (daysAgo === 1) {
    return "Yesterday";
  }

  return `${daysAgo} days ago`;
}

export function DateNavigator({ selectedDate, calendarToday }: DateNavigatorProps) {
  const isToday = selectedDate === calendarToday;
  const previousDate = addDays(selectedDate, -1);
  const nextDate = addDays(selectedDate, 1);
  const canGoForward = selectedDate < calendarToday;
  const relativeHint = getRelativeHint(selectedDate, calendarToday);
  const { long, short, compact } = formatDateParts(selectedDate);

  return (
    <nav aria-label="Choose day" className="date-nav">
      <div className="date-nav-shell">
      <div className="date-nav-toolbar">
        <Link
          aria-label="Previous day"
          className="date-nav-btn"
          href={`/?date=${previousDate}`}
          scroll={false}
        >
          <ChevronLeftIcon />
        </Link>

        <div className="date-nav-display">
          <p className="date-nav-primary">
            {isToday ? "Today" : <span className="hidden sm:inline">{long}</span>}
            {!isToday ? <span className="sm:hidden">{short}</span> : null}
          </p>
          <p className="date-nav-secondary">
            {isToday ? (
              <>
                <span className="hidden sm:inline">{long}</span>
                <span className="sm:hidden">{compact}</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{compact}</span>
                <span className="sm:hidden">{long}</span>
              </>
            )}
          </p>
          {relativeHint ? <p className="date-nav-hint">{relativeHint}</p> : null}
        </div>

        {canGoForward ? (
          <Link
            aria-label="Next day"
            className="date-nav-btn"
            href={`/?date=${nextDate}`}
            scroll={false}
          >
            <ChevronRightIcon />
          </Link>
        ) : (
          <span aria-disabled="true" aria-label="Next day unavailable" className="date-nav-btn date-nav-btn-disabled">
            <ChevronRightIcon />
          </span>
        )}
      </div>

      {!isToday ? (
        <div className="date-nav-today-row">
          <Link className="date-nav-today grid place-items-center" href="/" scroll={false}>
            Back to today
          </Link>
        </div>
      ) : null}
      </div>
    </nav>
  );
}
