import { AppHeader } from "@/components/AppHeader";
import { EmptyState } from "@/components/EmptyState";
import { GraphLegend } from "@/components/GraphLegend";
import { GraphScroller } from "@/components/GraphScroller";
import { GroupedSection } from "@/components/GroupedSection";
import { SegmentedLink } from "@/components/SegmentedLink";
import { SegmentedScroll } from "@/components/SegmentedScroll";
import { TodaySummary } from "@/components/TodaySummary";
import {
  getCompletionYears,
  getCompletionsForYear,
  getHabits,
  getTodayCompletions,
} from "@/lib/db";
import { formatPercent } from "@/lib/format";
import { getHabitColor } from "@/lib/habit-colors";
import { TodayClient } from "./TodayClient";

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getYearMonths(year: number) {
  const today = new Date();
  const months = [];

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const firstDay = new Date(year, monthIndex, 1);
    const isFutureMonth =
      year > today.getFullYear() ||
      (year === today.getFullYear() && monthIndex > today.getMonth());

    if (isFutureMonth) {
      break;
    }

    const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();
    const lastDay = new Date(year, monthIndex + 1, 0);
    const endDay = isCurrentMonth ? today.getDate() : lastDay.getDate();
    const days: Array<string | null> = Array.from({ length: firstDay.getDay() }, () => null);

    for (let day = 1; day <= endDay; day += 1) {
      days.push(toDateKey(new Date(year, monthIndex, day)));
    }

    months.push({
      key: `${year}-${monthIndex + 1}`,
      label: firstDay.toLocaleString("en", { month: "short" }),
      days,
    });
  }

  return months;
}

function countTrackableDays(months: ReturnType<typeof getYearMonths>) {
  return months.reduce(
    (total, month) => total + month.days.filter((day) => day !== null).length,
    0,
  );
}

function getSelectedYear(value: string | undefined) {
  const currentYear = new Date().getFullYear();
  const year = Number(value);

  if (!Number.isInteger(year) || year < 2000 || year > currentYear) {
    return currentYear;
  }

  return year;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; year?: string }>;
}) {
  const params = await searchParams;
  const selectedYear = getSelectedYear(params.year);
  const graphView = params.view === "archived" ? "archived" : "active";
  const [activeHabits, graphHabits, completions, completionYears, todayCompletions] =
    await Promise.all([
      getHabits("active"),
      getHabits(graphView),
      getCompletionsForYear(selectedYear),
      getCompletionYears(),
      getTodayCompletions(),
    ]);
  const months = getYearMonths(selectedYear);
  const trackableDays = countTrackableDays(months);
  const todayCompleted = new Set(todayCompletions.map((completion) => completion.habit_id));
  const yearOptions = Array.from(new Set([new Date().getFullYear(), ...completionYears])).sort(
    (first, second) => second - first,
  );
  const graphQuery = graphView === "archived" ? "&view=archived" : "";

  return (
    <main className="app-shell">
      <AppHeader
        primaryAction={{ href: "/habits", label: "Manage" }}
        subtitle="Mark today in one tap. Review your year when you are ready."
        title="Today"
      />

      <GroupedSection hideHeaderOnMobile title="Today">
        <TodaySummary completed={todayCompleted.size} total={activeHabits.length} />

        {activeHabits.length === 0 ? (
          <EmptyState
            action={{ href: "/habits", label: "Create your first habit" }}
            description="Start with one small habit you can finish today."
            title="Nothing to track yet"
          />
        ) : (
          <TodayClient activeHabits={activeHabits} todayCompletions={todayCompletions} />
        )}
       </GroupedSection>

      <GroupedSection
        badge={String(selectedYear)}
        hint="Each square is one day · tap and hold for the date"
        title="Progress"
        controls={
          <div className="flex flex-col gap-2 md:gap-2.5">
            <div className="hidden md:block">
              <GraphLegend />
            </div>
            <div className="flex flex-col gap-2">
              <SegmentedScroll label="Habit view">
                <SegmentedLink
                  active={graphView === "active"}
                  href={`/?year=${selectedYear}`}
                  label="Active"
                />
                <SegmentedLink
                  active={graphView === "archived"}
                  href={`/?year=${selectedYear}&view=archived`}
                  label="Archived"
                />
              </SegmentedScroll>
              <SegmentedScroll label="Year">
                {yearOptions.map((year) => (
                  <SegmentedLink
                    active={year === selectedYear}
                    href={`/?year=${year}${graphQuery}`}
                    key={year}
                    label={String(year)}
                  />
                ))}
              </SegmentedScroll>
            </div>
          </div>
        }
      >
        {graphHabits.length === 0 ? (
          <EmptyState
            description={
              graphView === "archived"
                ? "Archived habits will show up here with their history."
                : "Create a habit on the Habits page to see your calendar."
            }
            title={graphView === "archived" ? "No archived habits" : "No habits to graph"}
          />
        ) : (
          graphHabits.map((habit) => {
            const completedDays = new Set(
              completions
                .filter((completion) => completion.habit_id === habit.id)
                .map((completion) => completion.completed_on),
            );
            const color = getHabitColor(habit.id);
            const rate = formatPercent(completedDays.size, trackableDays);

            return (
              <article className="graph-article border-t border-[var(--border-default)] p-3 first:border-t-0 sm:p-4" key={habit.id}>
                <div className="graph-habit-header">
                  <div className="flex min-w-0 items-center gap-2">
                    <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${color}`} />
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-[var(--text-primary)]">{habit.title}</h3>
                      <p className="apple-footnote tabular-nums">
                        {rate}% · {completedDays.size}/{trackableDays} days
                      </p>
                    </div>
                  </div>
                </div>

                <GraphScroller>
                  {months.map((month) => (
                    <div className="shrink-0" key={month.key}>
                      <p className="apple-caption font-semibold">{month.label}</p>
                      <div className="gap-1.5 grid grid-rows-7 grid-flow-col mt-2">
                        {month.days.map((day, index) =>
                          day ? (
                            <div
                              aria-label={`${habit.title} on ${day}: ${
                                completedDays.has(day) ? "done" : "not done"
                              }`}
                              className={`graph-cell graph-cell-size border ${
                                completedDays.has(day)
                                  ? `${color} border-[var(--graph-cell-border-done)]`
                                  : "border-[var(--graph-empty-border)] bg-[var(--graph-empty)]"
                              }`}
                              key={day}
                              title={`${day}: ${completedDays.has(day) ? "Done" : "Missed"}`}
                            />
                          ) : (
                            <div
                              aria-hidden="true"
                              className="graph-cell-blank"
                              key={`${month.key}-blank-${index}`}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </GraphScroller>
              </article>
            );
          })
        )}
      </GroupedSection>
    </main>
  );
}
