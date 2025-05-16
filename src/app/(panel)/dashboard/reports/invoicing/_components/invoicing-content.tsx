"use client"

import { DateRangePicker } from "@/components/date-range-picker"
import { PerformanceContent } from "./performance-content"
import { BarChartLabel } from "./bar-chart-label"
import { InvoicingDateProps } from "../../types/invoicing-date"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchData } from "@/utils/fetch-data"
import { InvoiceProps } from "../../types/invoicing"

export function InvoicingContent() {
  const searchParams = useSearchParams();
  const startDateString = searchParams.get('start-date') as string;
  const endDateString = searchParams.get('end-date') as string;

  const {
    data: invoicingDate,
    isLoading: isLoadinginvoicingDate,
    refetch: refetchinvoicingDate,
  } = useQuery({
    queryKey: ["get-metrics-invoicing-date", startDateString, endDateString],
    queryFn: () =>
      fetchData<InvoicingDateProps>("metrics/invoicing-date", {
        "start-date": startDateString,
        "end-date": endDateString,
      }),
    enabled: !!startDateString && !!endDateString,
    staleTime: 80000,
    refetchInterval: 90000
  });

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-montserrat text-primary text-center">Faturamento</h1>

      {isLoadinginvoicingDate ? (
        <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <PerformanceContent data={invoicingDate?.forSpecificDate} />
        </>
      )}
      {isLoadinginvoicingDate ? (
        <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <BarChartLabel
            chartData={invoicingDate?.sixMonth.monthlyData || []}
            totalSixMonth={invoicingDate?.sixMonth.totalSixMonth || 0}
          />
        </>
      )}
    </main>
  )
}