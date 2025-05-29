import Image from "next/image";
import img_hero from "@/assets/woman-posing-with-bathrobe-spa.png";
import { BgHero } from "./bg-hero";
import { Check } from "lucide-react";
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits";

export function Hero() {
  return (
    <section className="relative w-full h-175">
      <BgHero />

      <div className="container mx-auto sm:px-1 min-h-150 px-6">

        <main className="flex flex-col lg:flex-row items-center justify-between px-6 w-full h-full gap-6 sm:pt-40 pt-20">

          <article className="text-primary z-10 pt-5 space-y-5 max-w-3xl lg:w-1/2 w-full flex flex-col justify-center">
            <h1 className="text-shadow-md font-montserrat">
              <span className="text-accent font-semibold lg:text-7xl text-6xl">
                Otimize sua prática
              </span>
              <br className="md:block hidden" />
              <span className="font-semibold lg:text-7xl text-6xl lg:ml-0 ml-2">
                de massoterapia
              </span>
            </h1>

            <p className="text-xl">
              A plataforma de gestão completa projetada especificamente para massoterapeutas. Agende consultas, gerencie clientes e expanda seus negócios com facilidade
            </p>

            <div
              className="p-4 bg-accent rounded-3xl w-fit  text-white font-semibold shadow-md hover:shadow-lg"
            >
              Comece seu test gratuito de {TRIAL_DAYS} dias
            </div>

            <div className="lg:hidden w-fit border border-dashed border-ring rounded-full flex gap-2.5 items-center justify-center text-center font-semibold md:text-xl p-2 uppercase text-primary">
              <p>50% no primeiro mês</p>
              <p>use: MAS50OFF</p>
            </div>

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

            <div className="absolute bottom-5 left-5 z-10 border border-dashed border-ring rounded-full flex gap-2.5 items-center justify-center text-center font-semibold text-xl p-2 uppercase text-primary bg-white/40 backdrop-blur-xl">
              <p>50% off no primeiro mês</p>
              <p>use: MAS50OFF</p>
            </div>


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

        </main>

      </div>
    </section>
  )
}