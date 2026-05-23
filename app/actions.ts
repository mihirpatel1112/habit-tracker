"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  isAuthenticated,
  validateCredentials,
} from "@/lib/auth";
import { isDateKey } from "@/lib/dates";
import { ensureArchiveColumn, getCalendarToday, sql } from "@/lib/db";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }
}

function revalidateHabitPages() {
  revalidatePath("/");
  revalidatePath("/habits");
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!validateCredentials(username, password)) {
    redirect("/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

export async function createHabit(formData: FormData) {
  await requireAuth();

  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return;
  }

  await sql`
    insert into habits (title)
    values (${title})
  `;

  revalidateHabitPages();
}

export async function permanentlyDeleteArchivedHabit(formData: FormData) {
  await requireAuth();
  await ensureArchiveColumn();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  await sql`
    delete from habits
    where id = ${id}
      and archived_at is not null
  `;

  revalidateHabitPages();
}

export async function archiveHabit(formData: FormData) {
  await requireAuth();
  await ensureArchiveColumn();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  await sql`
    update habits
    set archived_at = now()
    where id = ${id}
  `;

  revalidateHabitPages();
}

export async function toggleToday(formData: FormData) {
  await requireAuth();
  await ensureArchiveColumn();

  const id = Number(formData.get("id"));
  const isDone = formData.get("isDone") === "true";
  const calendarToday = await getCalendarToday();
  const rawDate = String(formData.get("completedOn") ?? "").trim();
  const completedOn = rawDate || calendarToday;

  if (!Number.isInteger(id) || !isDateKey(completedOn) || completedOn > calendarToday) {
    return;
  }

  if (isDone) {
    await sql`
      delete from habit_completions
      where habit_id = ${id}
        and completed_on = ${completedOn}::date
    `;

    revalidateHabitPages();
    return;
  }

  await sql`
    insert into habit_completions (habit_id, completed_on)
    select id, ${completedOn}::date
    from habits
    where id = ${id}
      and archived_at is null
    on conflict (habit_id, completed_on) do nothing
  `;

  revalidateHabitPages();
}
