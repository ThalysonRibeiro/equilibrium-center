"use client"
import { InputSearch } from "@/components/input-search";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AllAppointmentProps } from "../../reports/types/allApponitments";
import { createQueryFetcher } from "@/utils/createQueryFetcher";
import { fromUrlFriendly } from "@/utils/toUrlFriendly";
import { Appointment } from "./appointments";
import { DateRangePicker } from "@/components/date-range-picker";
import GeneratePDFAppointments from "@/components/generatePDF/generate-pdf-appointments";
import { ProgressAppointments } from "./pregress-appointments";
import { StatusFilters } from "./statusFilters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LoadingUI } from "@/components/ui/loading-ui";

interface ClientsContentProps {
  planId: string
  download_pdf: boolean
  limitReport: string[]
}

export function ClientsContent({ planId, download_pdf, limitReport }: ClientsContentProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const startDateString = searchParams.get('start-date') as string;
  const endDateString = searchParams.get('end-date') as string;
  const statusString = searchParams.get('status') as string;

  const [search, setSearch] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string[]>(
    [search, statusString].filter(Boolean)
  );

  const { data, isLoading } = useQuery({
    queryKey: ["get-allAppointments-and-details", startDateString, endDateString],
    queryFn: createQueryFetcher<AllAppointmentProps>("metrics/all-appointments", {
      "start-date": startDateString,
      "end-date": endDateString,
    }),
    enabled: !!startDateString && !!endDateString,
    staleTime: 80000,
    refetchInterval: 90000
  });

  const appointmentsFiltered = data?.allAppointments.filter((appointment) => {
    if (searchTerm.length === 0) return true;
    const {
      name,
      email,
      phone,
      service,
      time,
      status,
    } = appointment;
    const searchableText = [
      name,
      email,
      phone,
      time,
      status,
      service.name,
      service.price
    ].filter(Boolean)// remove valores nulos/undefined
      .join(" ")
      .toLowerCase()
      .replace(/[áàâãä]/gi, 'a')
      .replace(/[éèêë]/gi, 'e')
      .replace(/[íìîï]/gi, 'i')
      .replace(/[óòôõö]/gi, 'o')
      .replace(/[úùûü]/gi, 'u')

    return searchTerm.every(term =>
      searchableText.includes(fromUrlFriendly(term).toLowerCase())
    );
  });

  useEffect(() => {
    setSearchTerm(
      [search, statusString].filter(Boolean)
    );
  }, [search, statusString]);

  function openFilters() {
    setIsFiltersOpen(prev => !prev);
  }

  return (
    <>
      {isLoading ? (
        <><LoadingUI /></>
      ) : (
        <section className="space-y-4">
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
              startDate={data?.startDate || new Date()}
              endDate={data?.endDate || new Date()}
              loading={isLoading}
              metricStatus={data?.metricStatus || null}
              countAllAppointments={data?.countAllAppointments || 0}
            />
          )}

          <h2 className="text-2xl font-semibold text-center">Pesquisa por cliente especifico</h2>

          <div className="flex gap-4">
            <InputSearch
              search={search}
              setSearch={(event: string) => setSearch(event)}
            />
            <Button
              onClick={openFilters}
              className="h-10 border hover:bg-accent"
            >
              {isFiltersOpen ? <ChevronUp /> : <ChevronDown />}
              Filtros
            </Button>
          </div>
          {isFiltersOpen && (
            <div className="flex items-center gap-4">
              <span>Total de resultados: {appointmentsFiltered?.length}</span>
              <StatusFilters />
            </div>
          )}
          <Appointment appointments={appointmentsFiltered || []} planId={planId} />
        </section>
      )}
    </>
  )
}