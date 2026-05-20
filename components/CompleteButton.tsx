"use client";

import { useFormStatus } from "react-dom";
import { toggleToday } from "@/app/actions";

function Spinner() {
  return (
    <span
      aria-hidden
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
    />
  );
}

function CompleteButtonControl({
  isDone,
  colorClass,
  habitTitle,
}: {
  isDone: boolean;
  colorClass: string;
  habitTitle: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      aria-label={
        pending
          ? `Updating ${habitTitle}`
          : isDone
            ? `Undo ${habitTitle}`
            : `Complete ${habitTitle}`
      }
      className={`complete-button grid shrink-0 place-items-center rounded-full text-lg font-semibold transition enabled:active:scale-95 disabled:opacity-70 ${
        isDone ? `complete-filled ${colorClass} text-white` : "complete-ring text-[var(--label-tertiary)]"
      }`}
      disabled={pending}
      type="submit"
    >
      {pending ? <Spinner /> : isDone ? "✓" : null}
    </button>
  );
}

interface CompleteButtonProps {
  habitId: number;
  isDone: boolean;
  habitTitle: string;
  colorClass: string;
}

export function CompleteButton({ habitId, isDone, habitTitle, colorClass }: CompleteButtonProps) {
  return (
    <form action={toggleToday} className="shrink-0">
      <input name="id" type="hidden" value={habitId} />
      <input name="isDone" type="hidden" value={String(isDone)} />
      <CompleteButtonControl colorClass={colorClass} habitTitle={habitTitle} isDone={isDone} />
    </form>
  );
}
