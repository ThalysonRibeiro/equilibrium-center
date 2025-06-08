"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type RangerType = {
  status: string;
}

export function StatusFilters() {
  const router = useRouter();
  const [statusSelected, setStatusSelected] = useState<string>("");

  const updateURLWithPartialFilters = useCallback((filters: Partial<RangerType>) => {
    const url = new URL(window.location.href);
    if (filters.status) {
      url.searchParams.set("status", filters.status)
    } else {
      url.searchParams.delete("status");
    }
    router.replace(url.toString(), { scroll: false });
  }, [router]);

  useEffect(() => {
    updateURLWithPartialFilters({
      status: statusSelected
    })
  }, [statusSelected, updateURLWithPartialFilters]);

  const matStatus = [
    { id: "PENDING", status: "Pendente" },
    { id: "SCHEDULED", status: "Confirmado" },
    { id: "COMPLETED", status: "Completo" },
    { id: "NO_SHOW", status: "Não comparecido" },
    { id: "CANCELLED", status: "Cancelado" }
  ];

  function handleClearFilters() {
    let startDate: Date;
    let endDate: Date;

    const now = new Date();
    startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 29, 0, 0, 0));
    endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    setStatusSelected("");
    router.replace(`/dashboard/clients?start-date=${format(startDate, "yyyy-MM-dd")}&end-date=${format(endDate, "yyyy-MM-dd")}`, { scroll: false });
  }

  const getSelectedStatusLabel = () => {
    const selectedStatus = matStatus.find(item => item.id === statusSelected);
    return selectedStatus ? selectedStatus.status : "Nenhum status selecionado";
  };

  return (
    <div
      className="flex gap-4"
      role="group"
      aria-label="Filtros de status de agendamentos"
    >
      <div className="relative">
        <label
          htmlFor="status-filter"
          className="sr-only"
        >
          Filtrar por status do agendamento
        </label>
        <Select
          onValueChange={(value) => { setStatusSelected(value) }}
          value={statusSelected}
          aria-label="Selecionar status para filtrar agendamentos"
        >
          <SelectTrigger
            className="w-[165px]"
            id="status-filter"
            aria-describedby="status-filter-help"
          >
            <SelectValue
              placeholder="Selecione o status"
              aria-label={statusSelected ? `Status selecionado: ${getSelectedStatusLabel()}` : "Nenhum status selecionado"}
            />
          </SelectTrigger>
          <SelectContent role="listbox" aria-label="Opções de status">
            {matStatus.map(item => (
              <SelectItem
                key={item.id}
                value={item.id}
                role="option"
                aria-selected={statusSelected === item.id}
              >
                {item.status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div id="status-filter-help" className="sr-only">
          Use este filtro para mostrar apenas agendamentos com o status selecionado
        </div>
      </div>

      <Button
        onClick={handleClearFilters}
        className="border hover:bg-accent"
        aria-label="Limpar todos os filtros e retornar aos últimos 30 dias"
        type="button"
      >
        Limpar filtros
      </Button>

      {/* Feedback para leitores de tela sobre o filtro ativo */}
      {statusSelected && (
        <div
          className="sr-only"
          aria-live="polite"
          role="status"
        >
          Filtro ativo: mostrando apenas agendamentos com status {getSelectedStatusLabel()}
        </div>
      )}
    </div>
  )
}