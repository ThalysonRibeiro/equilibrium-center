"use client"
import { useQuery } from "@tanstack/react-query";
import { BarChartLastOfWeek } from "./bar-chart-lastOfWeek";
import { TopHours } from "./top-hours";
import { fetchData } from "@/utils/fetch-data";
import { WeeklySummaryProps } from "../types/weekly-summary";
import { LoadingUI } from "@/components/ui/loading-ui";

export function ContentOfTheWeek() {

  const {
    data: weeklySummary,
    isLoading: isLoadingWeeklySummary,
    refetch: refetchWeeklySummary,
  } = useQuery({
    queryKey: ["get-metrics-weekly-summary"],
    queryFn: () => fetchData<WeeklySummaryProps | null>("metrics/weekly-summary"),
    staleTime: 80000,
    refetchInterval: 90000
  });

  if (isLoadingWeeklySummary) {
    return (
      <LoadingUI />
    )
  }

  return (
    <section className="space-y-4 w-full mb-4">
      {weeklySummary && (
        <>
          <BarChartLastOfWeek data={weeklySummary} />
          <TopHours data={weeklySummary} />
        </>
      )}
    </section>
  )
}