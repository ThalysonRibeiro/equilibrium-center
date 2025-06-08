"use client"

import { DateRangePicker } from "@/components/date-range-picker"
import { PerformanceContent } from "./performance-content"
import { BarChartLabel } from "./bar-chart-label"
import { InvoicingDateProps } from "../../types/invoicing-date"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchData } from "@/utils/fetch-data"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GeneratePDFInvoicingDate from "../../../../../../components/generatePDF/generate-pdf-invoicing-date"
import { addDays, format } from "date-fns"
import { InvoiceProps } from "../../types/invoicing"
import { CardTotalINvoicing } from "./card-total-invoicing"
import { TopServicesContent } from "./topServices-content"

export function InvoicingContent({ limitReport, download_pdf, planId }: { limitReport: string[], download_pdf: boolean, planId: string }) {
  const searchParams = useSearchParams();
  let startDate;
  let endDate;

  if (!startDate && !endDate) {
    const newDate = addDays(new Date(), -30)
    startDate = format(newDate, "yyyy-MM-dd");
    endDate = format(new Date(), "yyyy-MM-dd");
  } else {
    startDate = searchParams.get('start-date') as string;
    endDate = searchParams.get('end-date') as string;
  }
  const shouldFetch = !!startDate && !!endDate;

  const {
    data: invoicing,
    isLoading: isLoadinginvoicing,
  } = useQuery({
    queryKey: ["get-metrics-invoicing-date"],
    queryFn: () =>
      fetchData<InvoiceProps>("metrics/invoicing"),
    staleTime: 80000,
    refetchInterval: 90000,
  });

  const {
    data: invoicingDate,
    isLoading: isLoadinginvoicingDate,
  } = useQuery({
    queryKey: ["get-metrics-invoicing-date", startDate, endDate],
    queryFn: () =>
      fetchData<InvoicingDateProps>("metrics/invoicing-date", {
        "start-date": startDate,
        "end-date": endDate,
      }),
    enabled: shouldFetch,
    staleTime: 80000,
    refetchInterval: 90000,
  });

  // Calcula a diferença em dias com verificação de validade
  const start = invoicingDate?.forSpecificDate?.startDateConsultation;
  const end = invoicingDate?.forSpecificDate?.endDateConsultation;
  let days = null;

  if (start && end) {
    const diffTime = new Date(end).getTime() - new Date(start).getTime();
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  if (!invoicingDate || !invoicing) {
    return (
      <main className="text-center mt-10 text-muted-foreground">
        <div className="w-full rounded-l flex items-center justify-center gap-4">
          <span className="text-xl font-semibold">
            Carregando
            <span className="animate-pulse">.</span>
            <span className="animate-pulse delay-150">.</span>
            <span className="animate-pulse delay-300">.</span>
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold text-center">Metricas de Faturamento</h1>

      {limitReport.includes("cardTotalINvoicing") && planId !== "EXPIRED" && (
        <CardTotalINvoicing data={invoicing} download_pdf={download_pdf} />
      )}

      {limitReport.includes("barChartLabel") && planId !== "EXPIRED" && (
        <BarChartLabel
          chartData={invoicingDate?.sixMonth.monthlyData || []}
          totalSixMonth={invoicingDate?.sixMonth.totalSixMonth || 0}
          download_pdf={download_pdf}
        />
      )}

      {limitReport.includes("topServicesContent") && planId !== "EXPIRED" && (
        <TopServicesContent download_pdf={download_pdf} />
      )}

      {limitReport.includes("performanceContent") && planId !== "EXPIRED" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <DateRangePicker value={30} />
              {download_pdf && (
                <GeneratePDFInvoicingDate data={invoicingDate.forSpecificDate} />
              )}
            </CardTitle>

            <CardDescription>
              Métricas de faturamento por data específica
              {days !== null && <> — Consulta equivalente a <span>{days}</span> dias</>}
            </CardDescription>
          </CardHeader>

          <PerformanceContent data={invoicingDate?.forSpecificDate} />
        </Card>
      )}
    </main>
  );
}
