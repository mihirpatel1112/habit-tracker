import Link from "next/link";
import { logout, toggleToday } from "@/app/actions";
import { GraphScroller } from "@/components/GraphScroller";
import {
  getCompletionYears,
  getCompletionsForYear,
  getHabits,
  getTodayCompletions,
} from "@/lib/db";

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
    const days: Array<string | null> = Array.from(
      { length: firstDay.getDay() },
      () => null,
    );

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

const habitColors = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-fuchsia-500",
];

function getHabitColor(habitId: number) {
  return habitColors[Math.abs(habitId) % habitColors.length];
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
  const todayCompleted = new Set(todayCompletions.map((completion) => completion.habit_id));
  const yearOptions = Array.from(
    new Set([new Date().getFullYear(), ...completionYears]),
  ).sort((first, second) => second - first);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="rounded-4xl border border-white/70 bg-white/55 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Habit dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Keep the streak alive.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Track today fast, then check your progress one year at a time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
            href="/habits"
          >
            Create habits
          </Link>
          <form action={logout}>
            <button
              className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
              type="submit"
            >
              Log out
            </button>
          </form>
        </div>
        </div>
      </header>

      <section className="mt-6 rounded-4xl border border-white/70 bg-white/55 p-4 shadow-xl shadow-sky-900/10 backdrop-blur-xl sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Today</h2>
          <p className="rounded-full bg-emerald-100/80 px-3 py-1 text-sm font-medium text-emerald-700">
            {todayCompleted.size}/{activeHabits.length} complete
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {activeHabits.length === 0 ? (
            <p className="rounded-3xl bg-white/60 p-4 text-sm text-slate-600">
              No active habits. Create one on the habits page.
            </p>
          ) : (
            activeHabits.map((habit) => {
              const isDone = todayCompleted.has(habit.id);

              return (
                <div
                  className="flex items-center justify-between gap-3 rounded-3xl border border-white/70 bg-white/65 p-3 shadow-sm backdrop-blur"
                  key={habit.id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{habit.title}</p>
                    <p className="text-xs text-slate-500">
                      {isDone ? "Completed today" : "Not completed today"}
                    </p>
                  </div>

                  <form action={toggleToday}>
                    <input name="id" type="hidden" value={habit.id} />
                    <input name="isDone" type="hidden" value={String(isDone)} />
                    <button
                      aria-label={isDone ? `Undo ${habit.title}` : `Complete ${habit.title}`}
                      className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl font-black text-white shadow-lg transition hover:-translate-y-0.5 ${
                        isDone
                          ? "bg-linear-to-br from-rose-400 to-red-600 shadow-red-500/25"
                          : "bg-linear-to-br from-emerald-300 to-green-600 shadow-emerald-500/25"
                      }`}
                      type="submit"
                    >
                      {isDone ? "×" : "✓"}
                    </button>
                  </form>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-6 rounded-4xl border border-white/70 bg-white/55 p-4 shadow-xl shadow-sky-900/10 backdrop-blur-xl sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Habit graphs</h2>
          <p className="rounded-full bg-sky-100/80 px-3 py-1 text-sm font-medium text-sky-700">
            {selectedYear}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              graphView === "active"
                ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                : "border border-white/70 bg-white/55 text-slate-600"
            }`}
            href={`/?year=${selectedYear}`}
          >
            Active
          </Link>
          <Link
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              graphView === "archived"
                ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                : "border border-white/70 bg-white/55 text-slate-600"
            }`}
            href={`/?year=${selectedYear}&view=archived`}
          >
            Archived
          </Link>
          {yearOptions.map((year) => (
            <Link
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                year === selectedYear
                  ? "bg-white text-slate-950 shadow-sm"
                  : "border border-white/70 bg-white/45 text-slate-600"
              }`}
              href={`/?year=${year}${graphView === "archived" ? "&view=archived" : ""}`}
              key={year}
            >
              {year}
            </Link>
          ))}
        </div>

        <div className="mt-5 space-y-6">
          {graphHabits.length === 0 ? (
            <p className="rounded-3xl bg-white/60 p-4 text-sm text-slate-600">
              No {graphView} habits to show.
            </p>
          ) : (
            graphHabits.map((habit) => {
              const completedDays = new Set(
                completions
                  .filter((completion) => completion.habit_id === habit.id)
                  .map((completion) => completion.completed_on),
              );
              const color = getHabitColor(habit.id);

              return (
                <article
                  className="rounded-[1.75rem] border border-white/70 bg-white/65 p-4 shadow-lg shadow-sky-900/5 backdrop-blur"
                  key={habit.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-950">{habit.title}</h3>
                      <p className="text-sm text-slate-500">
                        {completedDays.size} days completed in {selectedYear}
                      </p>
                    </div>
                    <span className={`h-4 w-4 rounded ${color} shadow-sm`} />
                  </div>

                  <GraphScroller>
                    {months.map((month) => (
                      <div className="shrink-0" key={month.key}>
                        <p className="text-xs font-semibold text-slate-500">{month.label}</p>
                        <div className="mt-2 grid grid-flow-col grid-rows-7 gap-1.5">
                          {month.days.map((day, index) =>
                            day ? (
                              <div
                                aria-label={`${habit.title} on ${day}: ${
                                  completedDays.has(day) ? "done" : "not done"
                                }`}
                                className={`h-4 w-4 rounded-md shadow-sm ring-1 ring-white/70 ${
                                  completedDays.has(day) ? color : "bg-white/70"
                                }`}
                                key={day}
                                title={`${day}: ${completedDays.has(day) ? "done" : "not done"}`}
                              />
                            ) : (
                              <div
                                aria-hidden="true"
                                className="h-4 w-4"
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
        </div>
      </section>
    </main>
  );
}
