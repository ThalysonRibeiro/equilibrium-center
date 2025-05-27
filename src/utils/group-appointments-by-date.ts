
export type DataTimes = {
  appointmentDate?: Date;
  count: number;
  daysOfWeek: string;
};

const daysOfWeek = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado'
];


export function groupAppointmentsByDate(
  appointments: { appointmentDate?: Date | string }[],
  weekStart: Date
): Map<string, DataTimes> {

  const map = new Map<string, DataTimes>();

  for (let i = 0; i < 7; i++) {
    const current = new Date(weekStart);
    current.setDate(weekStart.getDate() + i);
    const dateKey = current.toISOString().split("T")[0];

    const dayIndex = current.getUTCDay(); // Corrige a correspondência do dia da semana

    map.set(dateKey, {
      appointmentDate: current,
      daysOfWeek: daysOfWeek[dayIndex],
      count: 0,
    });
  }

  appointments.forEach(({ appointmentDate }) => {
    if (!appointmentDate) return;

    const date = new Date(appointmentDate);
    const dateKey = date.toISOString().split("T")[0];

    const existing = map.get(dateKey);
    if (existing) {
      existing.count++;
    }
  });

  return map;
}
