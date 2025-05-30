"use client"
import * as React from "react";
import Image from "next/image";
import hero_professionals from "@/assets/hero-professionals.webp";
import {
  Card,
  CardContent, CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Prisma, User } from "@/generated/prisma";
import { toUrlFriendly } from "@/utils/toUrlFriendly";
import { scrollTosection } from "@/utils/scrollTosection";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    service: {
      select: {
        name: true
      }
    }
  };
}>;


interface HeroProfessionalsProps {
  professionals: UserWithServiceAndSubscription[];
}

type RangerType = {
  service: string;
  location: string;
}

export function Hero({ professionals }: HeroProfessionalsProps) {
  const router = useRouter();

  const uniqueServs = Array.from(
    new Set(
      professionals.flatMap(professional =>
        professional.service.map(serv => serv.name.toLowerCase())
      )
    )
  );

  const uniqueLocation = Array.from(
    new Set(
      professionals
        .map((p) => p.state?.trim())
        .filter((addr): addr is string => !!addr) // Remove falsy ("" ou null)
    )
  );

  const [selectedService, setSelectedService] = React.useState<string>("");
  const [selectedlocation, setSelectedLocation] = React.useState<string>("");

  const updateURLWithFilters = React.useCallback((ranger: RangerType) => {
    const url = new URL(window.location.href);
    url.searchParams.set("service", ranger.service);
    url.searchParams.set("location", ranger.location);
    router.push(url.toString());
  }, [router]);

  React.useEffect(() => {
    if (selectedService && selectedlocation) {
      updateURLWithFilters({
        service: toUrlFriendly(selectedService),
        location: toUrlFriendly(selectedlocation)
      });
    }
  }, [selectedService, selectedlocation, updateURLWithFilters]);

  return (
    <section className="container mx-auto h-125 px-6 space-y-4 flex flex-col justify-center">
      <div className="absolute inset-0 top-0 left-0 w-full h-125 -z-10">
        <Image
          src={hero_professionals}
          fill
          alt="fundo de hero pagina  de profissionais"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950 to-sky-700/50"></div>
      </div>
      <div className="md:w-3/5 w-full py-6">
        <h1 className="text-white text-5xl font-bold">
          Encontre a sua experiência de
          <br />
          <span className="text-accent">
            massagem perfeita
          </span>
        </h1>
        <h2 className="max-w-[80%] text-lg text-white">
          Descubra as melhores clínicas de massagem perto de você. Agende sua consulta e comece sua jornada rumo ao bem-estar hoje mesmo.
        </h2>
      </div>

      <Card className="max-w-125 w-ful">
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de serviço</Label>
            <Select onValueChange={(value: string) => { setSelectedService(value) }} defaultValue={selectedService}>
              <SelectTrigger className="w-full">
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
          <div className="space-y-2">
            <Label>Localização</Label>
            <Select onValueChange={(value: string) => { setSelectedLocation(value) }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocation.map(loc => (
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
        </CardContent>

        <CardFooter>
          <Button
            className="w-full hover:bg-accent"
            onClick={() => scrollTosection("professionalsNoFeatured")}
          >
            Encontre Profissionais
          </Button>
        </CardFooter>
      </Card>

    </section>
  )
}