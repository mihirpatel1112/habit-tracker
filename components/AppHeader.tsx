import Link from "next/link";
import { MobileSettingsSheet } from "@/components/MobileSettingsSheet";
import { formatTodayLong, formatTodayShort, getGreeting } from "@/lib/format";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  primaryAction?: { href: string; label: string };
}

export function AppHeader({ title, subtitle, primaryAction }: AppHeaderProps) {
  const greeting = getGreeting();
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayLong = formatTodayLong();
  const todayShort = formatTodayShort();

  return (
    <>
      <header className="app-hero-mobile md:hidden">
        <div className="app-hero-card">
          <div className="app-hero-top">
            <div className="min-w-0">
              <p className="app-hero-greeting">{greeting}</p>
              <time className="app-hero-date" dateTime={todayIso}>
                {todayShort}
              </time>
            </div>
            <div className="app-hero-toolbar">
              <MobileSettingsSheet />
            </div>
          </div>

          <div className="app-hero-body">
            <h1 className="app-hero-page-title">{title}</h1>
            {subtitle ? <p className="app-hero-subtitle">{subtitle}</p> : null}
            {primaryAction ? (
              <Link className="app-hero-cta" href={primaryAction.href}>
                {primaryAction.label} →
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <header className="app-page-header-desktop surface-card-elevated hidden md:flex">
        <div className="min-w-0">
          <p className="apple-caption">
            {greeting} · <time dateTime={todayIso}>{todayLong}</time>
          </p>
          <h1 className="apple-heading-1 mt-1">{title}</h1>
          {subtitle ? <p className="apple-footnote mt-2 max-w-xl">{subtitle}</p> : null}
        </div>

        {primaryAction ? (
          <Link className="btn-primary shrink-0" href={primaryAction.href}>
            {primaryAction.label}
          </Link>
        ) : null}
      </header>
    </>
  );
}
