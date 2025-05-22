import { AppointmentStatus } from "@/generated/prisma";

export interface InvoiceProps {
  metricsTotalInvoicing: MetricsTotalInvoicingProps;
  currentPeriod: CurrentAndPreviousPeriodProps;
  previousPeriod: CurrentAndPreviousPeriodProps;
  comparison: ComparisonProps;
}

export interface MetricsTotalInvoicingProps {
  appointments: AppointmentsProps[];
  totalAppointments: number;
  totalInvoicing: number;
  possibleLosses: number;
  totalAppointmentCancelled: number;
}

export interface AppointmentsProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointmentDate: Date;
  time: string;
  status: AppointmentStatus;
  serviceId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  service: {
    name: string;
    price: string;
    duration: number;
  }
}

interface CurrentAndPreviousPeriodProps {
  appointments: AppointmentsProps[];
  totalAppointments: number;
  totalRevenue: number;
  startDate: Date;
  endDate: Date;
}

interface ComparisonProps {
  revenueChangePercent: number;
  appointmentChangePercent: number;
}