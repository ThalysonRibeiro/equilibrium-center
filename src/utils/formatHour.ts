export function FormatHour(value: number) {
  const hour = Math.floor(value / 60).toString().padStart(2, '0');
  const minutes = (value % 60).toString().padStart(2, '0');
  return `${hour}:${minutes}`
}