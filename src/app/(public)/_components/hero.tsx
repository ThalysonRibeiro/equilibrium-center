"use client"
import Image from "next/image";
import img_hero from "@/assets/woman-posing-with-bathrobe-spa.png";
import { BgHero } from "./bg-hero";
import { Check } from "lucide-react";
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits";
import { toast } from "sonner";
import { redirect } from "next/navigation";


export function Hero() {
  async function handleCopyCupon() {
    await navigator.clipboard.writeText(`MAS50OFF`);
    toast("Cupom copiado com sucesso!");
  }
  return (
    <section id="hero" className="relative w-full h-screen min-h-175">
      <BgHero />

      <div className="container mx-auto sm:px-1 min-h-150">

        <div className="flex flex-col lg:flex-row items-center justify-between px-6 w-full h-full gap-6 sm:pt-40 pt-20">

          <article className="text-primary z-10 pt-5 space-y-5 max-w-3xl lg:w-1/2 w-full flex flex-col justify-center">
            <h1 className="font-semibold uppercase  lg:text-6xl md:text-6xl sm:text-4xl text-3xl">
              <span className="text-accent">
                Otimize sua prática de
              </span>
              <br />
              <span>
                massoterapia
              </span>
            </h1>

            <p className="sm:text-lg">
              A plataforma de gestão completa projetada especificamente para massoterapeutas. Agende consultas, gerencie clientes e expanda seus negócios com facilidade
            </p>

            <button
              onClick={() => redirect("/login")}
              className="cursor-pointer p-4 bg-accent rounded-full w-fit text-sm md:text-base text-white font-semibold shadow-md hover:shadow-lg focus:border border-primary"
            >
              Comece seu test gratuito de {TRIAL_DAYS} dias
            </button>

            <button
              onClick={handleCopyCupon}
              className="lg:hidden w-fit border border-dashed border-ring rounded-full flex flex-col sm:flex-row px-6 gap-2.5 items-center justify-center text-center font-semibold  text-sm md:text-xl p-2 uppercase text-primary focus:bg-accent focus-within:text-white cursor-pointer"
            >
              <span>50% no primeiro mês</span>
              <span>use: MAS50OFF</span>
            </button>

            <div className="flex gap-4 flex-col md:flex-row text-sm">
              <p className="flex items-center">
                <Check className="text-white rounded-full p-0.5 w-4 h-4 bg-ring mr-1" />
                Não é necessário cartão de crédito
              </p>
              <p className="flex items-center">
                <Check className="text-white rounded-full p-0.5 w-4 h-4 bg-ring mr-1" />
                Cancelar a qualquer momento
              </p>
            </div>
          </article>

          <article className="hidden lg:block relative w-1/2">

            <button
              onClick={handleCopyCupon}
              className="cursor-pointer absolute bottom-5 left-5 z-10 border border-dashed border-ring rounded-full flex gap-2.5 items-center justify-center text-center font-semibold text-xl p-2 uppercase text-primary bg-white/40 backdrop-blur-xl focus:bg-accent focus-within:text-white">
              <p>50% off no primeiro mês</p>
              <p>use: MAS50OFF</p>
            </button>

            <div className="relative w-full h-125 rounded-4xl shadow-lg">
              <Image
                src={img_hero}
                alt="imagem do hero inlustratica"
                fill
                priority
                quality={100}
                className="object-cover rounded-2xl"
              />
            </div>
          </article>

        </div>

      </div>
    </section>
  )
}