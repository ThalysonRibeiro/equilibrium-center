import { Prisma } from "@/generated/prisma";

export interface AllAppointmentProps {
  tartDate: Date;
  endDate: Date;
  allAppointments: AppointmentWithService[];
  countAllAppointments: number;
  groupedCustomers: GroupedCustomersProps[];
  metricStatus: MetricStatusProps;
}

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: {
      select: {
        name: true,
        price: true,
        duration: true,
      }
    }
  }
}>;

interface GroupedCustomersProps {
  name: string;
  email: string;
  phone: string;
  quantidade: number;
}

export interface MetricStatusProps {
  countByStatus: CountByStatusProps;
  percentageByStatus: PercentageByStatusProps;
}
type CountByStatusProps = {
  countPending: number;
  countScheduled: number;
  countCompleted: number;
  countNo_show: number;
  countCancelled: number;
}
type PercentageByStatusProps = {
  countPending: string;
  countScheduled: string;
  countCompleted: string;
  countNo_show: string;
  countCancelled: string;
}