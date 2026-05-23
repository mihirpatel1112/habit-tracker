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
    <aside className="app-sidebar hidden md:flex">
      <div className="px-2 pt-1">
        <p className="apple-caption font-semibold text-[var(--accent)]">Habits</p>
        <p className="apple-heading-3 mt-0.5">Tracker</p>
      </div>

      <nav aria-label="Main" className="mt-6 flex flex-1 flex-col gap-1 px-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.Icon;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`sidebar-nav-link ${isActive ? "sidebar-nav-link-active" : ""}`}
              href={link.href}
              key={link.href}
            >
              <Icon aria-hidden size={18} strokeWidth={isActive ? 2.25 : 1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-[var(--border-default)] px-1 pt-3">
        <ThemeToggle fullWidth />
        <form action={logout}>
          <button className="btn-secondary flex w-full items-center justify-center gap-2" type="submit">
            <LogOut aria-hidden size={16} strokeWidth={2} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
