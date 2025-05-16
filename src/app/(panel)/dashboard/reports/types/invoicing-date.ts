import { AppointmentStatus } from "@/generated/prisma";

export interface InvoicingDateProps {
  forSpecificDate: ForSpecificDateProps;
  sixMonth: SixMonthProps;
  totalRevenue: TotalRevenueProps;
}

export interface ForSpecificDateProps {
  specificDate: AppointmentsProps[];
  totalAppointmentSpecificDate: number;
  totalInvoicingspecificDate: number;
  startDateConsultation: Date;
  endDateConsultation: Date;
}

interface SixMonthProps {
  monthlyData: MonthlyDataProps[];
  totalSixMonth: number;
}

export interface MonthlyDataProps {
  month: string;
  total: number;
}

interface TotalRevenueProps {
  totalAppointments: number;
  totalInvoicing: number;
  appointments: AppointmentsProps[];
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