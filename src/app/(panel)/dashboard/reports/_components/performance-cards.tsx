"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { InvoiceProps } from "../types/invoicing";
import { CardPerformance } from "@/components/card-performance";
import { fetchData } from "@/utils/fetch-data";

export function PerformanceCards() {
  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: ["get-metrics-overview",],
  //   queryFn: async () => {
  //     const url = `${process.env.NEXT_PUBLIC_URL}/api/metrics/invoicing`;
  //     const response = await fetch(url);
  //     const json = await response.json() as InvoiceProps;

  //     if (!response.ok) {
  //       throw new Error("Erro ao buscar métricas");
  //     }

  //     return json;
  //   },
  //   staleTime: 20000, // 20 segundos de staletime
  //   refetchInterval: 30000
  // })

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-metrics-overview"],
    queryFn: () => fetchData<InvoiceProps>("metrics/invoicing"),
    staleTime: 80000,
    refetchInterval: 90000
  });

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

          <CardPerformance
            title="Agendamentos"
            description="Agendamentos dos últimos 30 dias"
            titleContent="Agendamendo:"
            percent={data?.comparison.appointmentChangePercent || 0}
            total={data?.metricsTotalInvoicing.totalAppointments || 0}
          />
          <CardPerformance
            title="Receita"
            description="Receita dos últimos 30 dias"
            percent={data?.comparison.revenueChangePercent || 0}
            total={formatCurrency(String(data?.currentPeriod?.totalRevenue))}
          />

        </section>
      )}
    </>
  )
}