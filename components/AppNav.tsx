"use client";

import { CalendarDays, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Today", Icon: CalendarDays },
  { href: "/habits", label: "Habits", Icon: ListChecks },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="mobile-tab-bar md:hidden">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.Icon;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`mobile-tab-item ${isActive ? "mobile-tab-item-active" : ""}`}
            href={tab.href}
            key={tab.href}
          >
            <Icon
              aria-hidden
              className="mobile-tab-icon"
              size={22}
              strokeWidth={isActive ? 2.25 : 1.75}
            />
            <span className="mobile-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
