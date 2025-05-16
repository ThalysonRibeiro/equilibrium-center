import { Prisma } from "@/generated/prisma";

export interface AllAppointmentProps {
  tartDate: Date;
  endDate: Date;
  allAppointments: AppointmentWithService[];
  countAllAppointments: number;
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
export interface MetricStatusProps {
  countByStatus: CountByStatusProps;
  percentageByStatus: CercentageByStatusProps;
}
type CountByStatusProps = {
  countPending: number;
  countScheduled: number;
  countCompleted: number;
  countNo_show: number;
  countCancelled: number;
}
type CercentageByStatusProps = {
  countPending: string;
  countScheduled: string;
  countCompleted: string;
  countNo_show: string;
  countCancelled: string;
}