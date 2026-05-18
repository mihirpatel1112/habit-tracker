import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL env var.");
}

export const sql = postgres(databaseUrl, {
  max: 1,
  prepare: false,
});

/** Habits roll over at local midnight in this zone (not DB/session `current_date`). */
export const HABIT_CALENDAR_TIME_ZONE = "Australia/Sydney";

export type Habit = {
  id: number;
  title: string;
  created_at: Date;
  archived_at: string | null;
};

export type Completion = {
  habit_id: number;
  completed_on: string;
};

type CompletionYear = {
  year: number;
};

let archiveColumnReady: Promise<unknown> | null = null;

export function ensureArchiveColumn() {
  archiveColumnReady ??= sql`
    alter table habits
    add column if not exists archived_at timestamptz
  `;

  return archiveColumnReady;
}

export async function getHabits(status: "active" | "archived" | "all" = "active") {
  await ensureArchiveColumn();

  if (status === "archived") {
    return sql<Habit[]>`
      select id, title, created_at, archived_at::text as archived_at
      from habits
      where archived_at is not null
      order by archived_at desc
    `;
  }

  if (status === "all") {
    return sql<Habit[]>`
      select id, title, created_at, archived_at::text as archived_at
      from habits
      order by created_at desc
    `;
  }

  return sql<Habit[]>`
    select id, title, created_at, archived_at::text as archived_at
    from habits
    where archived_at is null
    order by created_at desc
  `;
}

export async function getCompletionsForYear(year: number) {
  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;

  return sql<Completion[]>`
    select habit_id, completed_on::text as completed_on
    from habit_completions
    where completed_on >= ${startDate}::date
      and completed_on < ${endDate}::date
    order by completed_on asc
  `;
}

export async function getCompletionYears() {
  const years = await sql<CompletionYear[]>`
    select distinct extract(year from completed_on)::int as year
    from habit_completions
    order by year desc
  `;

  return years.map((row) => row.year);
}

export async function getTodayCompletions() {
  return sql<Completion[]>`
    select habit_id, completed_on::text as completed_on
    from habit_completions
    where completed_on = (current_timestamp at time zone ${HABIT_CALENDAR_TIME_ZONE})::date
  `;
}
