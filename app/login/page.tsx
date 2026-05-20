import { login } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="login-shell page-enter">
      <div className="login-shell-top">
        <ThemeToggle fullWidth />
      </div>

      <div className="liquid-glass-elevated login-card">
        <p className="tahoe-caption font-semibold text-[var(--tint)]">Habits</p>
        <h1 className="tahoe-large-title mt-1 text-[var(--label-primary)]">Sign In</h1>
        <p className="tahoe-footnote mt-2">
          Your habits are private. Sign in to track and review progress.
        </p>

        <form action={login} className="mt-7 space-y-4">
          <div>
            <label className="tahoe-caption mb-1.5 block font-semibold text-[var(--label-primary)]" htmlFor="username">
              Username
            </label>
            <input
              autoComplete="username"
              autoFocus
              className="field-glass"
              id="username"
              name="username"
              type="text"
              required
            />
          </div>

          <div>
            <label className="tahoe-caption mb-1.5 block font-semibold text-[var(--label-primary)]" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="field-glass"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          {error === "invalid" ? (
            <p
              className="rounded-[var(--radius-glass-sm)] px-3 py-2.5 text-sm font-medium"
              role="alert"
              style={{
                background: "var(--destructive-surface)",
                color: "var(--destructive)",
              }}
            >
              Incorrect username or password. Try again.
            </p>
          ) : null}

          <button className="btn-glass-prominent w-full" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
