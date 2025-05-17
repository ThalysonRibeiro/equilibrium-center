"use client"

import { DateRangePicker } from "@/components/date-range-picker"
import { PerformanceContent } from "./performance-content"
import { BarChartLabel } from "./bar-chart-label"
import { InvoicingDateProps } from "../../types/invoicing-date"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchData } from "@/utils/fetch-data"
import { InvoiceProps } from "../../types/invoicing"
import { useEffect } from "react"

export function InvoicingContent() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('start-date') as string;
  const endDate = searchParams.get('end-date') as string;
  const shouldFetch = !!startDate && !!endDate;

  const {
    data: invoicingDate,
    isLoading: isLoadinginvoicingDate,
    refetch: refetchinvoicingDate,
  } = useQuery({
    queryKey: ["get-metrics-invoicing-date", startDate, endDate],
    queryFn: () =>
      fetchData<InvoicingDateProps>("metrics/invoicing-date", {
        "start-date": startDate,
        "end-date": endDate,
      }),
    enabled: shouldFetch,
    staleTime: 80000,
    refetchInterval: 90000
  });

  useEffect(() => {
    if (startDate && endDate) {
      refetchinvoicingDate(); // força a query se os parâmetros estiverem prontos
    }
  }, [startDate, endDate, refetchinvoicingDate]);

  if (!invoicingDate) return null


  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-montserrat text-primary text-center">Faturamento</h1>

      {isLoadinginvoicingDate ? (
        <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {invoicingDate?.forSpecificDate && (
            <PerformanceContent data={invoicingDate?.forSpecificDate} />
          )}
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