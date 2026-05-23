interface HabitFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export function HabitForm({ action }: HabitFormProps) {
  return (
    <form action={action} className="list-row flex-col gap-3 sm:flex-row sm:items-end">
      <div className="w-full flex-1">
        <label className="apple-caption mb-1.5 block font-semibold text-[var(--text-primary)]" htmlFor="title">
          New habit
        </label>
        <input
          autoComplete="off"
          className="field-input"
          id="title"
          maxLength={80}
          name="title"
          placeholder="e.g. Morning run"
          type="text"
          required
        />
      </div>

      <button className="btn-primary w-full shrink-0 sm:w-auto" type="submit">
        Add Habit
      </button>
    </form>
  );
}
