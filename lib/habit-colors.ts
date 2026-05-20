export const habitColors = [
  "bg-[var(--habit-1)]",
  "bg-[var(--habit-2)]",
  "bg-[var(--habit-3)]",
  "bg-[var(--habit-4)]",
  "bg-[var(--habit-5)]",
  "bg-[var(--habit-6)]",
  "bg-[var(--habit-7)]",
  "bg-[var(--habit-8)]",
] as const;

export function getHabitColor(habitId: number) {
  return habitColors[Math.abs(habitId) % habitColors.length];
}
