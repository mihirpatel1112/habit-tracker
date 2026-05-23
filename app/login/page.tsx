import { login } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="login-shell">
      <div className="login-shell-top">
        <ThemeToggle fullWidth />
      </div>

      <div className="surface-card-elevated login-card">
        <p className="apple-caption font-semibold text-[var(--accent)]">Habits</p>
        <h1 className="apple-heading-1 mt-1">Sign In</h1>
        <p className="apple-footnote mt-2">
          Your habits are private. Sign in to track and review progress.
        </p>

        <form action={login} className="mt-7 space-y-4">
          <div>
            <label className="apple-caption mb-1.5 block font-semibold text-[var(--text-primary)]" htmlFor="username">
              Username
            </label>
            <input
              autoComplete="username"
              autoFocus
              className="field-input"
              id="username"
              name="username"
              type="text"
              required
            />
          </div>

          <div>
            <label className="apple-caption mb-1.5 block font-semibold text-[var(--text-primary)]" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="field-input"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          {error === "invalid" ? (
            <p
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium"
              role="alert"
              style={{
                background: "var(--destructive-surface)",
                color: "var(--destructive)",
              }}
            >
              Incorrect username or password. Try again.
            </p>
          ) : null}

          <button className="btn-primary w-full" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
