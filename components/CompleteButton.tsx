"use client";

import { useFormStatus } from "react-dom";
import { toggleToday } from "@/app/actions";

function Spinner() {
  return (
    <span
      aria-hidden
      className="opacity-80 border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin"
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
      className={`complete-button grid shrink-0 place-items-center rounded-full text-lg font-semibold transition-opacity duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${
        isDone ? `complete-filled ${colorClass} text-white` : "complete-ring text-[var(--text-tertiary)]"
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
  completedOn: string;
}

export function CompleteButton({
  habitId,
  isDone,
  habitTitle,
  colorClass,
  completedOn,
}: CompleteButtonProps) {
  return (
    <form action={toggleToday} className="shrink-0">
      <input name="id" type="hidden" value={habitId} />
      <input name="isDone" type="hidden" value={String(isDone)} />
      <input name="completedOn" type="hidden" value={completedOn} />
      <CompleteButtonControl colorClass={colorClass} habitTitle={habitTitle} isDone={isDone} />
    </form>
  );
}

function GraphDayButtonControl({
  isDone,
  habitTitle,
  colorClass,
  completedOn,
}: {
  isDone: boolean;
  habitTitle: string;
  colorClass: string;
  completedOn: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      aria-label={`${habitTitle} on ${completedOn}: ${
        isDone ? "done, tap to undo" : "not done, tap to mark"
      }`}
      className={`graph-cell graph-cell-size border cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
        isDone
          ? `${colorClass} border-[var(--graph-cell-border-done)]`
          : "border-[var(--graph-empty-border)] bg-[var(--graph-empty)]"
      }`}
      disabled={pending}
      title={`${completedOn}: ${isDone ? "Done" : "Missed"}`}
      type="submit"
    />
  );
}

interface GraphDayButtonProps {
  habitId: number;
  isDone: boolean;
  habitTitle: string;
  colorClass: string;
  completedOn: string;
}

export function GraphDayButton({
  habitId,
  isDone,
  habitTitle,
  colorClass,
  completedOn,
}: GraphDayButtonProps) {
  return (
    <form action={toggleToday} className="contents">
      <input name="id" type="hidden" value={habitId} />
      <input name="isDone" type="hidden" value={String(isDone)} />
      <input name="completedOn" type="hidden" value={completedOn} />
      <GraphDayButtonControl
        colorClass={colorClass}
        completedOn={completedOn}
        habitTitle={habitTitle}
        isDone={isDone}
      />
    </form>
  );
}
