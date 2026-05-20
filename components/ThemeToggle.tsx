"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/components/ThemeProvider";

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light mode", Icon: Sun },
  { value: "dark", label: "Dark mode", Icon: Moon },
  { value: "system", label: "Match system appearance", Icon: Monitor },
];

interface ThemeToggleProps {
  /** Full-width bar for desktop sidebar */
  fullWidth?: boolean;
}

export function ThemeToggle({ fullWidth = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      aria-label="Appearance"
      className={`theme-toggle ${fullWidth ? "theme-toggle-full" : ""}`}
      role="group"
    >
      {options.map(({ value, label, Icon }) => {
        const isActive = theme === value;

        return (
          <button
            aria-label={label}
            aria-pressed={isActive}
            className={`theme-toggle-btn ${isActive ? "theme-toggle-btn-active" : ""}`}
            key={value}
            onClick={() => setTheme(value)}
            title={label}
            type="button"
          >
            <Icon aria-hidden size={18} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
