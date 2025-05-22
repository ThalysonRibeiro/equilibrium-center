import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { BarChartMultiple } from "./_components/bar-chart-multiple";
import { DateRangePicker } from "../../../../components/date-range-picker";
import { Button } from "@/components/ui/button";
import { PerformanceCards } from "./_components/performance-cards";
import { ContentOfTheWeek } from "./_components/Content-ofTheWeek";


export default async function Reports() {

  const session = await getSession();
  if (!session) {
    redirect('/')
  }


  return (
    <main className="space-y-4">

      <div className="flex flex-col lg:flex-row items-center justify-between mb-3">
        <h1 className="text-xl font-montserrat text-primary flex-1">Dashboard - Visão geral últimos 30 dias</h1>
      </div>

      <PerformanceCards />
      <BarChartMultiple />
      <ContentOfTheWeek />
    </main>
  )
}