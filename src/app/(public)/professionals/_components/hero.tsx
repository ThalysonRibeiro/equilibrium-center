"use client"
import Image from "next/image";
import hero_professionals from "@/assets/hero-professionals.webp";
import { scrollTosection } from "@/utils/scrollTosection";
import { ChevronDown } from "lucide-react";

export function Hero() {

  return (
    <section className="relative container mx-auto h-175 px-6 space-y-4 flex flex-col justify-center items-center">
      <div className="fixed inset-0 top-0 left-0 w-full h-175 -z-10">
        <Image
          src={hero_professionals}
          fill
          alt="fundo de hero pagina  de profissionais"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950 to-sky-700/50" />
      </div>
      <div className="w-full py-6">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center">
          Encontre a sua experiência de
          <br />
          <span className="text-accent">
            massagem perfeita
          </span>
        </h1>
        <h2 className="md:text-lg text-white text-center mt-6">
          Descubra as melhores clínicas de massagem perto de você. Agende sua consulta e comece sua jornada rumo ao bem-estar hoje mesmo.
        </h2>
      </div>
      <button
        className="w-fit px-8 py-4 rounded-full text-xl font-semibold bg-white hover:bg-accent hover:text-white border-2 hover:border-white border-accent cursor-pointer transition-colors duration-500"
        onClick={() => scrollTosection("professionalsFeatured", "smooth")}
      >
        Encontre Profissionais
      </button>
      <div className="absolute left-1/2 bottom-0 animate-float">
        <ChevronDown className="w-10 h-10 text-accent absolute -top-16" />
        <ChevronDown className="w-10 h-10 text-accent absolute -top-13 opacity-70" />
      </div>
    </section>
  )
}