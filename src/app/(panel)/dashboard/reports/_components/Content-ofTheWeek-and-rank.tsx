"use client"
import { useQuery } from "@tanstack/react-query";
import { BarChartLastOfWeek } from "./bar-chart-lastOfWeek";
import { TopHours } from "./top-hours";
import { WeeklySummaryProps } from "../types/weekly-summary";
import { LoadingUI } from "@/components/ui/loading-ui";
import { RanksProps } from "../types/ranks";
import { TopCustomers } from "./top-customers";
import { createQueryFetcher } from "@/utils/createQueryFetcher";

export function ContentOfTheWeekAndRank({ limitReport, planId }: { limitReport: string[], planId: string }) {

  const {
    data: weeklySummary,
    isLoading: isLoadingWeeklySummary,
    refetch: refetchWeeklySummary,
  } = useQuery({
    queryKey: ["get-metrics-weekly-summary"],
    queryFn: createQueryFetcher<WeeklySummaryProps>("metrics/weekly-summary"),
    staleTime: 80000,
    refetchInterval: 90000,
  });

  const {
    data: topCustomersAndHours,
    isLoading: isLoadingTopCustomersAndHours,
    refetch: refetchTopCustomersAndHours,
  } = useQuery({
    queryKey: ["get-metrics-rank"],
    queryFn: createQueryFetcher<RanksProps>("metrics/ranks"),
    staleTime: 80000,
    refetchInterval: 90000,
  });

  if (isLoadingWeeklySummary && isLoadingTopCustomersAndHours) {
    return (
      <LoadingUI />
    )
  }

  return (
    <section className="space-y-4 w-full mb-4">
      {weeklySummary && (
        <>
          {(limitReport.includes("barChartLastOfWeek") || planId === "TRIAL") && (
            <BarChartLastOfWeek data={weeklySummary} />
          )}
        </>
      )}
      {topCustomersAndHours && (
        <div className="flex gap-4 flex-col xl:flex-row">
          {(limitReport.includes("topCustomers") || planId === "TRIAL") && (
            <TopCustomers data={topCustomersAndHours} />
          )}
          {(limitReport.includes("topHours") || planId === "TRIAL") && (
            <TopHours data={topCustomersAndHours} />
          )}
        </div>
      )}
    </section>
  )
}