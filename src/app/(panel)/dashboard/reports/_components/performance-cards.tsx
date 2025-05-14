"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { AppointmentStatus } from "@/generated/prisma";
import { TrendingDown, TrendingUp } from "lucide-react";
import { join } from "path";
import { formatCurrency } from "@/utils/formatCurrency";

interface OverviewProps {
  metricsTotalInvoicing: MetricsTotalInvoicingProps;
  currentPeriod: CurrentAndPreviousPeriodProps;
  previousPeriod: CurrentAndPreviousPeriodProps;
  comparison: ComparisonProps;
}

interface MetricsTotalInvoicingProps {
  appointments: AppointmentsProps[];
  totalAppointments: number;
  totalInvoicing: number;
}

interface AppointmentsProps {
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
    price: string;
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

export function PerformanceCards() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-metrics-overview",],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/metrics/invoicing`;
      const response = await fetch(url);
      const json = await response.json() as OverviewProps;

      if (!response.ok) {
        throw new Error("Erro ao buscar métricas");
      }

      return json;
    },
    staleTime: 20000, // 20 segundos de staletime
    refetchInterval: 30000
  })

  return (
    <>
      {isLoading ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
          </div>
          <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 text-primary">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-montserrat inline-flex justify-between w-full">
                Agendamentos

                {typeof data?.comparison?.appointmentChangePercent === "number" && (
                  <div className="border rounded-md px-2 py-1 inline-flex items-center text-sm font-normal">
                    {data.comparison?.appointmentChangePercent >= 100 ? (
                      <span className="text-green-500 font-semibold inline-flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +{data.comparison?.appointmentChangePercent.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold inline-flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" /> {data.comparison?.appointmentChangePercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </CardTitle>

              <CardDescription>
                Tendências de Agendamentos.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col">
              <span className="font-montserrat text-4xl">
                {typeof data?.comparison?.appointmentChangePercent === "number"
                  ? `${Math.abs(data.comparison?.appointmentChangePercent).toFixed(2)}%`
                  : "0.00%"}
              </span>
              <span className="text-2xl font-montserrat">
                Agendamento: {data?.currentPeriod?.totalAppointments ?? 0}
              </span>
            </CardContent>
          </Card>


          <Card className="text-primary">
            <CardHeader>
              <CardTitle className="md:text-xl font-montserrat inline-flex items-center justify-between w-full">
                Receita

                {typeof data?.comparison?.revenueChangePercent === "number" && (
                  <div className="border rounded-md px-2 py-1 inline-flex items-center text-sm font-normal">
                    {data.comparison.revenueChangePercent >= 100 ? (
                      <span className="text-green-500 font-semibold inline-flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +{data.comparison.revenueChangePercent.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold inline-flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" /> {data.comparison.revenueChangePercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Tendências de Receita.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
              <span className="font-montserrat text-4xl">
                {typeof data?.comparison?.revenueChangePercent === "number"
                  ? `${Math.abs(data.comparison.revenueChangePercent).toFixed(2)}%`
                  : "0.00%"}
              </span>
              <span className="text-4xl font-montserrat">
                {formatCurrency(String(data?.currentPeriod?.totalRevenue))}
              </span>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  )
}