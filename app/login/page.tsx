import { login } from "@/app/actions";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-8 sm:px-6">
      <div className="rounded-4xl border border-white/70 bg-white/55 p-6 shadow-2xl shadow-sky-900/10 backdrop-blur-xl">
        <p className="text-sm font-medium text-sky-700">Habit Tracker</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Log in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This tracker is private. Log in to manage your habits.
        </p>

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="username">
              Username
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-slate-950 shadow-inner shadow-slate-900/5 outline-none backdrop-blur focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              id="username"
              name="username"
              type="text"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-slate-950 shadow-inner shadow-slate-900/5 outline-none backdrop-blur focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          {error === "invalid" ? (
            <p className="rounded-2xl bg-red-100/80 px-4 py-3 text-sm font-medium text-red-700">
              Wrong username or password.
            </p>
          ) : null}

          <button
            className="w-full rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
            type="submit"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
