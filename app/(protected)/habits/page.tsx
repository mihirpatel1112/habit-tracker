import Link from "next/link";
import {
  archiveHabit,
  createHabit,
  logout,
  permanentlyDeleteArchivedHabit,
} from "@/app/actions";
import { HabitForm } from "@/components/HabitForm";
import { getHabits } from "@/lib/db";

export default async function HabitsPage() {
  const [habits, archivedHabits] = await Promise.all([
    getHabits("active"),
    getHabits("archived"),
  ]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="rounded-4xl border border-white/70 bg-white/55 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Manage habits</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Create and archive habits.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep active habits clean. Archived habits keep their graph history.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
            href="/"
          >
            View graphs
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
        <HabitForm action={createHabit} />
      </section>

      <section className="mt-6 rounded-4xl border border-white/70 bg-white/55 p-4 shadow-xl shadow-sky-900/10 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Active habits</h2>
          <p className="text-sm text-slate-500">Archive habits you no longer track</p>
        </div>

        <div className="mt-4 space-y-3">
          {habits.length === 0 ? (
            <p className="rounded-3xl bg-white/60 p-4 text-sm text-slate-600">
              No active habits. Create your first one above.
            </p>
          ) : (
            habits.map((habit) => (
              <div
                className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
                key={habit.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{habit.title}</p>
                  <p className="text-xs text-slate-500">
                    Archived habits stay visible from the graph page.
                  </p>
                </div>

                <form action={archiveHabit}>
                  <input name="id" type="hidden" value={habit.id} />
                  <button
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white sm:w-auto"
                    type="submit"
                  >
                    Archive
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 rounded-4xl border border-white/70 bg-white/55 p-4 shadow-xl shadow-sky-900/10 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Archived habits</h2>
          <p className="text-sm text-slate-500">Permanent delete removes graph history too</p>
        </div>

        <div className="mt-4 space-y-3">
          {archivedHabits.length === 0 ? (
            <p className="rounded-3xl bg-white/60 p-4 text-sm text-slate-600">
              No archived habits yet.
            </p>
          ) : (
            archivedHabits.map((habit) => (
              <div
                className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
                key={habit.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{habit.title}</p>
                  <p className="text-xs text-slate-500">
                    Archived {habit.archived_at ? new Date(habit.archived_at).toLocaleDateString() : ""}
                  </p>
                </div>

                <form action={permanentlyDeleteArchivedHabit}>
                  <input name="id" type="hidden" value={habit.id} />
                  <button
                    className="w-full rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100 sm:w-auto"
                    type="submit"
                  >
                    Delete permanently
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
