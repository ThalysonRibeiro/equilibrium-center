"use client"

import { CustomerTable } from "./customer-table";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { DateRangePicker } from "../../../../../../components/date-range-picker";
import { ProgressAppointments } from "./pregress-appointments";
import { AllAppointmentProps } from "../../types/allApponitments";
import { fetchData } from "@/utils/fetch-data";
import GeneratePDFAppointments from "../../_components/generatePDF/generate-pdf-appointments";


export function AllAppointmentClient({ limitReport, download_pdf, planId }: { limitReport: string[], download_pdf: boolean, planId: string }) {
  const searchParams = useSearchParams();
  const startDateString = searchParams.get('start-date') as string;
  const endDateString = searchParams.get('end-date') as string;

  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["get-metrics-appointments", startDateString, endDateString],
    queryFn: async () =>
      fetchData<AllAppointmentProps>("metrics/all-appointments", {
        "start-date": startDateString,
        "end-date": endDateString,
      }),
    enabled: !!startDateString && !!endDateString,
    staleTime: 80000,
    refetchInterval: 90000
  })


  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-montserrat text-primary text-center">Atividade de agendamento de clientes</h1>
      <div className="flex items-center justify-between">
        {planId !== "EXPIRED" && (
          <DateRangePicker value={30} />
        )}
        {download_pdf && (
          <GeneratePDFAppointments data={data} />
        )}
      </div>
      {limitReport.includes("progressAppointments") && planId !== "EXPIRED" && (
        <ProgressAppointments
          loading={isLoading}
          metricStatus={data?.metricStatus || null}
          countAllAppointments={data?.countAllAppointments || 0}
        />
      )}

      {limitReport.includes("customerTable") && planId !== "EXPIRED" && (
        <CustomerTable loading={isLoading} appointment={data?.allAppointments || []} />
      )}
    </section>
  )
}