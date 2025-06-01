"use client"
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { ChevronDown, ChevronUp, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import img_test from "@/assets/img-hero.jpg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InputSearch } from "./input-search";
import { FaWhatsapp } from "react-icons/fa6";
import { extractPhoneNumber } from "@/utils/fomatPhone";
import { useSearchParams } from "next/navigation";
import { ProfessionalsProps } from "./professionals-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CardFilters } from "./card-filters";
import { fromUrlFriendly } from "@/utils/toUrlFriendly";
import { cn } from "@/lib/utils";




export function GridProfessionals({ professionals }: ProfessionalsProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [textVisible, setTextVisible] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");

  const paramService = searchParams.get("service") as string;
  const paramState = searchParams.get("state") as string;
  const paramCity = searchParams.get("city") as string;

  const [searchTerm, setSearchTerm] = useState<string[]>(
    [search, paramService, paramState, paramCity].filter(Boolean)
  );

  const Excludedplans = ["EXPIRED"];

  const validProfessionals = professionals.filter(
    professional => !Excludedplans.includes(professional.plan)
  );

  const professionalsFiltered = validProfessionals.filter((cliclic) => {
    if (searchTerm.length === 0) return true;

    const {
      name,
      service,
      state,
      city
    } = cliclic;

    const searchableText = [
      name,
      ...service.map(item => item.name), // espalha os nomes dos serviços
      state,
      city
    ].filter(Boolean) // remove valores nulos/undefined
      .join(' ')
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
      [search, paramService, paramState, paramCity].filter(Boolean)
    );
  }, [search, paramService, paramState, paramCity]);

  function openFilters() {
    setIsFiltersOpen(prev => !prev);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 700) {
        setTextVisible(true);
      } else {
        setTextVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {validProfessionals.length > 0 && (
        <section className="pt-12  backdrop-blur-md bg-white/50">
          <div className="container mx-auto px-6 space-y-6 flex flex-col items-center">
            <h2 className={cn(
              "text-primary text-3xl text-center mb-2 font-bold transition-colors duration-300 text-shadow-2xs",
              textVisible && "text-white"
            )}>
              Encontre a sua clínica de massagem ideal
            </h2>
            <p className={cn("text-center mb-2 transition-colors duration-300",
              textVisible && "text-white"
            )}>
              Navegue pelo nosso abrangente diretório de clínicas de massagem e encontre a ideal para suas necessidades.
            </p>

            <div className="w-full flex flex-col space-y-4 mt-6">
              <div className="flex gap-4 justify-between">
                <InputSearch
                  search={search}
                  setSearch={(event: string) => setSearch(event)}
                />
                <Button
                  onClick={openFilters}
                  className="hover:bg-accent"
                >
                  {isFiltersOpen ? <ChevronUp /> : <ChevronDown />}
                  Filtros
                </Button>
              </div>
              {isFiltersOpen && (
                <div className="flex gap-4">
                  <CardFilters professionals={professionals} />
                </div>
              )}
            </div>

            <article className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-6">
              {professionalsFiltered.map(professional => (
                <Card key={professional.id} className="relative overflow-hidden pt-0 hover:border-accent hover:shadow-teal-500/50 lg:hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
                  <CardContent className="p-0">
                    {professional.plan === "PROFESSIONAL" && (
                      <div className="absolute z-[1] top-3 left-3 text-xs text-yellow-950 font-semibold py-1 px-2 bg-yellow-500 w-fit rounded">
                        DESTAQUE
                      </div>
                    )}

                    <div className="relative h-50">
                      <Image
                        src={professional.image ?? img_test}
                        alt="imagem do profissional"
                        fill
                        className="object-cover"
                      />
                    </div>


                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="font-semibold capitalize text-gray-700">
                          {professional.name}
                        </h3>
                        <p className="text-sm text-gray-600 inline-flex gap-1 items-center">
                          <MapPin className="w-4 h-4" />
                          {professional.address ? professional.address : "Endereço não informado"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {professional.description}
                        </p>
                      </div>

                      {professional.phone && (
                        <div>
                          <Link
                            target="_blank"
                            href={`https://wa.me/55${extractPhoneNumber(professional?.phone ?? "")}?text=`}
                            className="text-sm text-gray-600 inline-flex items-center  gap-1"
                          >
                            <FaWhatsapp className="w-4 h-4" /> {professional?.phone}
                          </Link>
                        </div>
                      )}

                      {professional.times.length > 0 && (
                        <div className="text-sm text-gray-600 inline-flex gap-1 items-center">
                          <Clock className="w-4 h-4" />
                          {professional.times[0].replace(":", "h")}{" - "}
                          {professional.times[professional.times.length - 1].replace(":", "h")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/clinica/${professional.id}`}
                      target="_blank"
                      className="bg-accent hover:bg-ring text-white w-full flex items-center justify-center py-2 px-1 rounded-md text-sm font-medium"
                    >
                      Agendar horário
                      <ArrowRight className="ml-2" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </article>
          </div>


        </section>
      )}
    </>
  )
}