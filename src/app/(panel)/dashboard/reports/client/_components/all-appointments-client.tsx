"use client"

import { Prisma } from "@/generated/prisma";
import { CustomerTable } from "./customer-table"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { DateRangePicker } from "../../../../../../components/date-range-picker";
import { RadialContent } from "./radial-content";
import { ProgressAppointments } from "./pregress-appointments";


interface AllAppointmentProps {
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

export function AllAppointmentClient() {
  const searchParams = useSearchParams();
  const startDateString = searchParams.get('start-date');
  const endDateString = searchParams.get('end-date');
  const { data, isLoading } = useQuery({
    queryKey: ["get-metrics-appointments", startDateString, endDateString],
    queryFn: async () => {
      let activeStartDate = startDateString;
      let activeEndDate = endDateString;
      let url: string;
      if (!startDateString || !endDateString) {
        url = `${process.env.NEXT_PUBLIC_URL}/api/metrics/all-appointments`;
      } else {
        url = `${process.env.NEXT_PUBLIC_URL}/api/metrics/all-appointments?start-date=${activeStartDate}&end-date=${activeEndDate}`;
      }
      const response = await fetch(url);
      const json = await response.json() as AllAppointmentProps;

      if (!response.ok) {
        throw new Error("Erro ao buscar métricas");
      }

      return json;
    },
    staleTime: 20000,
    refetchInterval: 30000
  })

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-montserrat text-primary text-center">Atividade de agendamento de clientes</h1>
      <DateRangePicker value={30} />
      <ProgressAppointments
        loading={isLoading}
        metricStatus={data?.metricStatus || null}
        countAllAppointments={data?.countAllAppointments || 0}
      />
      <CustomerTable loading={isLoading} appointment={data?.allAppointments || []} />
    </section>
  )
}