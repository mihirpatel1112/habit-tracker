"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions";

export function SignOutButton() {
  return (
    <form action={logout}>
      <button aria-label="Sign out" className="icon-toolbar-btn" type="submit">
        <LogOut size={18} strokeWidth={2} />
      </button>
    </form>
  );
}
