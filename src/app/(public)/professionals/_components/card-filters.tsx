"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toUrlFriendly } from "@/utils/toUrlFriendly";
import { UserWithServiceAndSubscription } from "./professionals-content";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useState } from "react";


interface HeroProfessionalsProps {
  professionals: UserWithServiceAndSubscription[];
}

type RangerType = {
  service: string;
  state: string;
  city: string;
}

export function CardFilters({ professionals }: HeroProfessionalsProps) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSate, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const uniqueServs = Array.from(
    new Set(
      professionals.flatMap(professional =>
        professional.service.map(serv => serv.name.toLowerCase())
      )
    )
  );

  const uniqueState = Array.from(
    new Set(
      professionals
        .map((p) => p.state?.trim())
        .filter((addr): addr is string => !!addr)
    )
  );

  const filterUF = professionals.filter(
    professional => professional.state === selectedSate
  );

  const uniqueCity = Array.from(
    new Set(
      filterUF
        .map((p) => p.city?.trim())
        .filter((addr): addr is string => !!addr)
    )
  );

  const updateURLWithPartialFilters = useCallback((filters: Partial<RangerType>) => {
    const url = new URL(window.location.href);

    if (filters.service) {
      url.searchParams.set("service", toUrlFriendly(filters.service));
    } else {
      url.searchParams.delete("service");
    }

    if (filters.state) {
      url.searchParams.set("state", toUrlFriendly(filters.state));
    } else {
      url.searchParams.delete("state");
    }

    if (filters.city) {
      url.searchParams.set("city", toUrlFriendly(filters.city));
    } else {
      url.searchParams.delete("city");
    }

    router.replace(url.toString(), { scroll: false });
  }, [router]);

  useEffect(() => {
    updateURLWithPartialFilters({
      service: selectedService,
      state: selectedSate,
      city: selectedCity,
    });
  }, [selectedService, selectedSate, selectedCity, updateURLWithPartialFilters]);

  function handleClearFilters() {
    router.replace("/professionals", { scroll: false });
    setSelectedService("");
    setSelectedState("");
    setSelectedCity("");
  }

  return (
    <div className="w-full flex justify-between gap-4">
      <div className="space-y-2 w-full">
        <Label>Serviço</Label>
        <Select onValueChange={(value: string) => { setSelectedService(value) }} value={selectedService}>
          <SelectTrigger className="w-full backdrop-blur-sm">
            <SelectValue placeholder="serviço" />
          </SelectTrigger>
          <SelectContent>
            {uniqueServs.map(serv => (
              <SelectItem
                key={serv}
                value={serv}
              >
                {serv}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 w-full">
        <Label>Estado</Label>
        <Select onValueChange={(value: string) => { setSelectedState(value) }} value={selectedSate}>
          <SelectTrigger className="w-full backdrop-blur-sm">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {uniqueState.map(loc => (
              <SelectItem
                key={loc}
                value={loc}
              >
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedSate && (
        <div className="space-y-2 w-full">
          <Label>Cidade</Label>
          <Select onValueChange={(value: string) => { setSelectedCity(value) }} value={selectedCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCity.map(loc => (
                <SelectItem
                  key={loc}
                  value={loc}
                >
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button
        onClick={() => {
          handleClearFilters();
        }}
        className="hover:bg-accent mt-5.5 w-fit"
      >
        <Filter />
        Limpar filtros
      </Button>
    </div>
  )
}