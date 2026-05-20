"use client";

import { CalendarDays, ListChecks, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Today", Icon: CalendarDays },
  { href: "/habits", label: "Habits", Icon: ListChecks },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="liquid-glass fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-[var(--sidebar-width)] flex-col p-3 md:flex">
      <div className="px-2 pt-1">
        <p className="tahoe-caption font-semibold text-[var(--tint)]">Habits</p>
        <p className="tahoe-title-3 mt-0.5 text-[var(--label-primary)]">Tracker</p>
      </div>

      <nav aria-label="Main" className="mt-6 flex flex-1 flex-col gap-1 px-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.Icon;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--glass-bg-elevated)] text-[var(--tint)] shadow-[var(--glass-inset)]"
                  : "text-[var(--label-secondary)] hover:bg-[var(--glass-bg-subtle)] hover:text-[var(--label-primary)]"
              }`}
              href={link.href}
              key={link.href}
            >
              <Icon aria-hidden size={18} strokeWidth={isActive ? 2.25 : 1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-[var(--glass-border-subtle)] px-1 pt-3">
        <ThemeToggle fullWidth />
        <form action={logout}>
          <button className="btn-glass flex w-full items-center justify-center gap-2" type="submit">
            <LogOut aria-hidden size={16} strokeWidth={2} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
