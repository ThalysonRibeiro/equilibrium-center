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

  const totalResults = appointmentsFiltered?.length || 0;

  return (
    <>
      {isLoading ? (
        <div role="status" aria-label="Carregando dados dos clientes">
          <LoadingUI />
        </div>
      ) : (
        <main className="space-y-4" role="main">
          <header className="flex items-center justify-between" role="banner">
            {planId !== "EXPIRED" && (
              <div role="group" aria-label="Seletor de período">
                <DateRangePicker value={30} />
              </div>
            )}
            {download_pdf && (
              <div role="group" aria-label="Ações de download">
                <GeneratePDFAppointments data={data} />
              </div>
            )}
          </header>

          {limitReport.includes("progressAppointments") && planId !== "EXPIRED" && (
            <section aria-labelledby="progress-title" role="region">
              <h2 id="progress-title" className="sr-only">Progresso dos agendamentos</h2>
              <ProgressAppointments
                startDate={data?.startDate || new Date()}
                endDate={data?.endDate || new Date()}
                loading={isLoading}
                metricStatus={data?.metricStatus || null}
                countAllAppointments={data?.countAllAppointments || 0}
              />
            </section>
          )}

          <section aria-labelledby="search-section-title" role="region">
            <h2 id="search-section-title" className="text-2xl font-semibold text-center">
              Pesquisa por cliente específico
            </h2>

            <div className="flex gap-4" role="group" aria-label="Controles de pesquisa e filtros">
              <div className="flex-1">
                <InputSearch
                  search={search}
                  setSearch={(event: string) => setSearch(event)}
                  aria-label="Pesquisar clientes por nome, email, telefone ou serviço"
                />
              </div>
              <Button
                onClick={openFilters}
                className="h-10 border hover:bg-accent"
                aria-expanded={isFiltersOpen}
                aria-controls="filters-section"
                aria-label={`${isFiltersOpen ? 'Ocultar' : 'Mostrar'} filtros adicionais`}
              >
                <span aria-hidden="true">
                  {isFiltersOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
                Filtros
              </Button>
            </div>

            {isFiltersOpen && (
              <div
                id="filters-section"
                className="flex items-center gap-4"
                role="group"
                aria-label="Filtros e resultados"
              >
                <div
                  role="status"
                  aria-live="polite"
                  aria-label={`${totalResults} ${totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}`}
                >
                  <span>Total de resultados: {totalResults}</span>
                </div>
                <div role="group" aria-label="Filtros por status">
                  <StatusFilters />
                </div>
              </div>
            )}
          </section>

          <section aria-labelledby="appointments-table-title" role="region">
            <h3 id="appointments-table-title" className="sr-only">
              Lista de agendamentos filtrados
            </h3>
            <div aria-live="polite" aria-atomic="true">
              <Appointment appointments={appointmentsFiltered || []} planId={planId} />
            </div>
          </section>
        </main>
      )}
    </>
  )
}