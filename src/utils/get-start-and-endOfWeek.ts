export function getStartAndEndOfWeek(
  date = new Date(),
  startOnMonday = false
): { start: Date; end: Date } {
  const day = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado

  // Se a semana começa na segunda, ajustamos o cálculo
  const diffToStart = startOnMonday ? (day === 0 ? -6 : 1 - day) : -day;

  const start = new Date(date);
  start.setDate(date.getDate() + diffToStart);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
