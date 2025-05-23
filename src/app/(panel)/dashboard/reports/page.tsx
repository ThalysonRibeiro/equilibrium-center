import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { BarChartMultiple } from "./_components/bar-chart-multiple";
import { DateRangePicker } from "../../../../components/date-range-picker";
import { Button } from "@/components/ui/button";
import { PerformanceCards } from "./_components/performance-cards";
import { ContentOfTheWeekAndRank } from "./_components/Content-ofTheWeek-and-rank";
import { Suspense } from "react";
import { LoadingUI } from "@/components/ui/loading-ui";


export default async function Reports() {

  const session = await getSession();
  if (!session) {
    redirect('/')
  }


  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <LoadingUI />
      </div>
    }>
      <main className="space-y-4">

        <h1 className="text-2xl font-semibold text-primary text-center">
          Dashboard - Visão geral últimos 30 dias
        </h1>

        <PerformanceCards />
        <BarChartMultiple />
        <ContentOfTheWeekAndRank />
      </main>
    </Suspense>
  )
}