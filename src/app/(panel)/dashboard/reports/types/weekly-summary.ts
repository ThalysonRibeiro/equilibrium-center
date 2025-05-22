export interface WeeklySummaryProps {
  appointmentsOfWeek: number;
  daysOfWeekWithCounts: DaysOfWeekWithCountsProps[];
  hours: HoursProps[];
}

interface DaysOfWeekWithCountsProps {
  appointmentDate: Date;
  daysOfWeek: string;
  count: number;
}

interface HoursProps {
  time: string;
  count: number;
}