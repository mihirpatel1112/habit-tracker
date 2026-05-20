import { archiveHabit, createHabit, permanentlyDeleteArchivedHabit } from "@/app/actions";
import { AppHeader } from "@/components/AppHeader";
import { ConfirmForm } from "@/components/ConfirmForm";
import { EmptyState } from "@/components/EmptyState";
import { GroupedSection } from "@/components/GroupedSection";
import { HabitForm } from "@/components/HabitForm";
import { getHabits } from "@/lib/db";

export default async function HabitsPage() {
  const [habits, archivedHabits] = await Promise.all([
    getHabits("active"),
    getHabits("archived"),
  ]);

  return (
    <main className="app-shell page-enter">
      <AppHeader
        primaryAction={{ href: "/", label: "Today" }}
        subtitle="Add habits you care about. Archive when done — history stays on your graphs."
        title="Habits"
      />

      <GroupedSection hint="Short names work best — you will see them every day" title="New Habit">
        <HabitForm action={createHabit} />
      </GroupedSection>

      <GroupedSection badge={String(habits.length)} hint="Still tracking these" title="Active">
        {habits.length === 0 ? (
          <EmptyState
            description="Use the form above to add your first habit."
            title="No active habits"
          />
        ) : (
          habits.map((habit) => (
            <div className="list-row list-row-interactive flex-col items-stretch gap-3 sm:flex-row sm:items-center" key={habit.id}>
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--label-primary)]">{habit.title}</p>
                <p className="tahoe-footnote">Archive to hide from Today while keeping history.</p>
              </div>

              <ConfirmForm
                action={archiveHabit}
                message={`Archive "${habit.title}"? You can still see it in Progress → Archived.`}
              >
                <input name="id" type="hidden" value={habit.id} />
                <button className="btn-glass w-full sm:w-auto" type="submit">
                  Archive
                </button>
              </ConfirmForm>
            </div>
          ))
        )}
      </GroupedSection>

      <GroupedSection
        badge={String(archivedHabits.length)}
        hint="Permanent delete removes all graph history"
        title="Archived"
      >
        {archivedHabits.length === 0 ? (
          <EmptyState
            description="When you archive a habit, it moves here."
            title="No archived habits"
          />
        ) : (
          archivedHabits.map((habit) => (
            <div className="list-row list-row-interactive flex-col items-stretch gap-3 sm:flex-row sm:items-center" key={habit.id}>
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--label-primary)]">{habit.title}</p>
                <p className="tahoe-footnote">
                  Archived{" "}
                  {habit.archived_at
                    ? new Date(habit.archived_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </div>

              <ConfirmForm
                action={permanentlyDeleteArchivedHabit}
                message={`Permanently delete "${habit.title}" and all its history? This cannot be undone.`}
              >
                <input name="id" type="hidden" value={habit.id} />
                <button className="btn-destructive-glass w-full sm:w-auto" type="submit">
                  Delete
                </button>
              </ConfirmForm>
            </div>
          ))
        )}
      </GroupedSection>
    </main>
  );
}
