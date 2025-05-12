import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { BarChartMultiple } from "./_components/bar-chart-multiple";
import { DateRangePicker } from "./_components/date-range-picker";
import { Button } from "@/components/ui/button";
import { PerformanceCards } from "./_components/performance-cards";
import { DownloadIcon } from "lucide-react";


export default async function Reports() {

  const session = await getSession();
  if (!session) {
    redirect('/')
  }


  return (
    <main className="max-h-[cal(100vh-20rem)] h-full">

      <div className="flex flex-col lg:flex-row items-center justify-between mb-3">
        <h1 className="text-xl font-bold flex-1">Dashboard - Visão geral</h1>
        {/* <div className="flex-1 inline-flex gap-3 justify-between lg:justify-end w-full">
          <DateRangePicker />
          <Button
            variant={"secondary"}
            className=""
          >
            Download
            <DownloadIcon />
          </Button>
        </div> */}
      </div>

      <PerformanceCards />

      <BarChartMultiple />
    </main>
  )
}