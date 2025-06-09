"use client"
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import img_test from "@/assets/img-hero.jpg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { extractPhoneNumber } from "@/utils/fomatPhone";
import { ProfessionalsProps } from "./professionals-content";

export function FeaturedProfessional({ professionals }: ProfessionalsProps) {

  const featuredProfessional = professionals.filter(professional => professional.plan === "PROFESSIONAL");

  return (
    <>
      {featuredProfessional.length > 0 && (
        <section id="professionalsFeatured" className="pt-18 pb-6 bg-white">
          <div className="container mx-auto px-6 space-y-6 flex flex-col items-center">
            <h2 className="text-3xl text-center mb-2 font-bold">
              Clínicas em Destaque
            </h2>
            <p className="text-center mb-2">
              Descubra nossas clínicas de massagem mais bem avaliadas, que oferecem serviços excepcionais e uma variedade de tratamentos especializados.
            </p>

            <ScrollArea className="w-full">
              <article className="flex w-max space-x-4 p-4">
                {featuredProfessional.map(professional => (
                  <Card key={professional.id} className="relative h-125 w-90 overflow-hidden pt-0 hover:border-accent hover:shadow-teal-500/50 flex flex-col justify-between">
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
                          sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                        />
                      </div>


                      <div className="p-4 space-y-2">
                        <div>
                          <h3 className="font-semibold capitalize text-gray-700">
                            {professional.name}
                          </h3>
                          <p className="text-sm text-gray-600 inline-flex gap-1 items-center">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {professional.address ? professional.address : "Endereço não informado"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-3">
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
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      )}
    </>
  )
}