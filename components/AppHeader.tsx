import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
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
              <ThemeToggle />
              <SignOutButton />
            </div>
          </div>

          <div className="app-hero-body">
            <h1 className="app-hero-page-title">{title}</h1>
            {subtitle ? <p className="app-hero-subtitle">{subtitle}</p> : null}
            {primaryAction ? (
              <Link className="app-hero-cta" href={primaryAction.href}>
                <span>{primaryAction.label}</span>
                <ChevronRight aria-hidden size={18} strokeWidth={2.25} />
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <header className="app-page-header-desktop liquid-glass-elevated mb-6 hidden flex-col gap-4 p-5 md:flex md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="tahoe-caption">
            {greeting} · <time dateTime={todayIso}>{todayLong}</time>
          </p>
          <h1 className="tahoe-large-title mt-1 text-[var(--label-primary)]">{title}</h1>
          {subtitle ? <p className="tahoe-footnote mt-2 max-w-xl">{subtitle}</p> : null}
        </div>

        {primaryAction ? (
          <Link className="btn-glass-prominent shrink-0" href={primaryAction.href}>
            {primaryAction.label}
          </Link>
        ) : null}
      </header>
    </>
  );
}
