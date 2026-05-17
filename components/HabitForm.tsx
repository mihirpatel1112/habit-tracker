interface HabitFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export function HabitForm({ action }: HabitFormProps) {
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label className="sr-only" htmlFor="title">
          Habit title
        </label>
        <input
          className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-950 shadow-inner shadow-slate-900/5 outline-none backdrop-blur placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          id="title"
          name="title"
          placeholder="Create a habit"
          type="text"
          required
        />
      </div>

      <button
        className="rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
