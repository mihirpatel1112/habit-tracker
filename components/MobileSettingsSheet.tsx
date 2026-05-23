"use client";

import { LogOut, Settings, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { logout } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MobileSettingsSheet() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [close, open]);

  const sheet = open ? (
    <>
      <button
        aria-label="Close settings"
        className="mobile-settings-backdrop"
        onClick={close}
        type="button"
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="mobile-settings-sheet"
        role="dialog"
      >
        <div className="mobile-settings-handle" aria-hidden />
        <div className="mobile-settings-header">
          <h2 className="mobile-settings-title" id={titleId}>
            Settings
          </h2>
          <button
            aria-label="Close settings"
            className="mobile-settings-close"
            onClick={close}
            type="button"
          >
            <X aria-hidden size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="mobile-settings-group">
          <p className="mobile-settings-label">Appearance</p>
          <ThemeToggle fullWidth />
        </div>

        <form action={logout} className="mobile-settings-sign-out">
          <button
            className="btn-destructive flex w-full items-center justify-center gap-2"
            type="submit"
          >
            <LogOut aria-hidden size={16} strokeWidth={2} />
            Sign Out
          </button>
        </form>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Settings"
        className="mobile-settings-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Settings aria-hidden size={20} strokeWidth={1.75} />
      </button>

      {mounted && sheet ? createPortal(sheet, document.body) : null}
    </>
  );
}
