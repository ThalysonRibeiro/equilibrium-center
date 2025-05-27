export function getStartAndEndOfWeek(
  date = new Date(),
  startOnMonday = false
): { start: Date; end: Date } {
  const utcDay = date.getUTCDay(); // dia da semana em UTC

  const diffToStart = startOnMonday
    ? utcDay === 0 ? -6 : 1 - utcDay
    : -utcDay;

  const start = new Date(date);
  start.setUTCDate(date.getUTCDate() + diffToStart);
  start.setUTCHours(0, 0, 0, 0); // início do dia UTC

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999); // fim do dia UTC

  return { start, end };
}
