"use client"

import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/formatCurrency";
import { InvoiceProps } from "../types/invoicing";
import { CardPerformance } from "@/components/card-performance";
import { fetchData } from "@/utils/fetch-data";
import { LoadingUI } from "@/components/ui/loading-ui";

export function PerformanceCards() {

  const {
    data: invoicing,
    isLoading: isLoadingInvoicing,
    refetch: refetchInvoicing,
  } = useQuery({
    queryKey: ["get-metrics-overview"],
    queryFn: () => fetchData<InvoiceProps>("metrics/invoicing"),
    staleTime: 80000,
    refetchInterval: 90000
  });


  return (
    <>
      {isLoadingInvoicing ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingUI />
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 text-primary">

          <CardPerformance
            title="Agendamentos"
            description="Agendamentos dos últimos 30 dias"
            titleContent="Agendamendo:"
            percent={invoicing?.comparison.appointmentChangePercent || 0}
            total={invoicing?.metricsTotalInvoicing.totalAppointments || 0}
          />
          <CardPerformance
            title="Receita"
            description="Receita dos últimos 30 dias"
            percent={invoicing?.comparison.revenueChangePercent || 0}
            total={formatCurrency(String(invoicing?.currentPeriod?.totalRevenue))}
          />

        </section>
      )}
    </>
  )
}