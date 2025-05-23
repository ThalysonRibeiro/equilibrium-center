export interface WeeklySummaryProps {
  appointmentsOfWeek: number;
  daysOfWeekWithCounts: DaysOfWeekWithCountsProps[];
}

interface DaysOfWeekWithCountsProps {
  appointmentDate: Date;
  daysOfWeek: string;
  count: number;
}
