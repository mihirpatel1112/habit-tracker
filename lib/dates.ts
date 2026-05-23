export const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateKey(value: string) {
  return DATE_KEY_RE.test(value);
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, delta: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return toDateKey(new Date(year, month - 1, day + delta));
}

export function getSelectedDate(value: string | undefined, calendarToday: string) {
  if (!value || !isDateKey(value) || value > calendarToday) {
    return calendarToday;
  }

  return value;
}

export function daysBeforeToday(dateKey: string, calendarToday: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = calendarToday.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date(todayYear, todayMonth - 1, todayDay);

  return Math.round((today.getTime() - date.getTime()) / 86_400_000);
}
