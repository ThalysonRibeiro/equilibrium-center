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
  }, [statusSelected]);

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

  return (
    <div className="flex gap-4">
      <Select onValueChange={(value) => { setStatusSelected(value) }} value={statusSelected}>
        <SelectTrigger className="w-[165px]">
          <SelectValue placeholder="status" />
        </SelectTrigger>
        <SelectContent>
          {matStatus.map(item => (
            <SelectItem key={item.id} value={item.id}>{item.status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleClearFilters} className="border hover:bg-accent">
        Limpar filtros
      </Button>
    </div>
  )
}