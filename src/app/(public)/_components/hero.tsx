"use client"
import Image from "next/image";
import img_hero from "@/assets/woman-posing-with-bathrobe-spa.png";
import { BgHero } from "./bg-hero";
import { Check } from "lucide-react";
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useIsMobile } from "@/app/hooks/useMobile";
import { cn } from "@/lib/utils";

export function Hero() {
  const isMobile = useIsMobile(360)
  async function handleCopyCupon() {
    try {
      await navigator.clipboard.writeText(`MAS50OFF`);
      toast("Cupom copiado com sucesso!");
    } catch (error) {
      // Fallback para dispositivos que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = 'MAS50OFF';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast("Cupom copiado com sucesso!");
    }
  }

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-175 flex items-center"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <BgHero />

      <div className="container mx-auto sm:px-1">
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 w-full h-full gap-6 sm:pt-40 pt-20">

          <article className="text-primary z-10 pt-5 space-y-5 lg:w-1/2 w-full flex flex-col justify-center items-center">
            <h1
              id="hero-heading"
              className={cn("font-bold uppercase text-center lg:text-6xl md:text-6xl text-5xl",
                isMobile && "text-3xl"
              )}
            >
              <span className="text-accent">
                Otimize sua prática de
              </span>
              <br />
              <span>
                massoterapia
              </span>
            </h1>

            <p className="sm:text-lg text-center" role="text">
              A plataforma de gestão completa projetada especificamente para massoterapeutas. Agende consultas, gerencie clientes e expanda seus negócios com facilidade
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => redirect("/login")}
                className="cursor-pointer p-4 bg-accent rounded-full w-fit text-sm md:text-base text-white font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                aria-label={`Iniciar teste gratuito de ${TRIAL_DAYS} dias`}
              >
                Comece seu teste gratuito de {TRIAL_DAYS} dias
              </button>
              <button
                onClick={handleCopyCupon}
                className="lg:hidden w-fit border border-dashed border-ring rounded-full flex flex-col px-4 items-center justify-center text-center font-semibold text-xl p-2 uppercase text-primary hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                aria-label="Copiar cupom de desconto MAS50OFF para 50% de desconto no primeiro mês"
              >
                <span className="text-sm font-normal">50% no primeiro mês use:</span>
                <span>MAS50OFF</span>
              </button>
            </div>

            <div className="flex gap-4 flex-col md:flex-row text-sm" role="list">
              <p className="flex items-center" role="listitem">
                <Check
                  className="text-white rounded-full p-0.5 w-4 h-4 bg-ring mr-1"
                  aria-hidden="true"
                />
                <span>Não é necessário cartão de crédito</span>
              </p>
              <p className="flex items-center" role="listitem">
                <Check
                  className="text-white rounded-full p-0.5 w-4 h-4 bg-ring mr-1"
                  aria-hidden="true"
                />
                <span>Cancelar a qualquer momento</span>
              </p>
            </div>
          </article>

          <article className="hidden lg:block relative w-1/2" aria-label="Seção promocional">
            <button
              onClick={handleCopyCupon}
              className="cursor-pointer absolute bottom-5 left-5 z-10 border border-dashed border-ring rounded-full flex gap-2.5 items-center justify-center text-center font-semibold text-xl p-2 uppercase text-primary bg-white/40 backdrop-blur-xl hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
              aria-label="Copiar cupom de desconto MAS50OFF para 50% de desconto no primeiro mês"
            >
              <span>50% off no primeiro mês</span>
              <span>use: MAS50OFF</span>
            </button>

            <div className="relative w-full h-125 rounded-4xl shadow-lg">
              <Image
                src={img_hero}
                alt="Mulher relaxando em spa usando roupão, representando o bem-estar e cuidado oferecido pelos serviços de massoterapia"
                fill
                priority
                quality={100}
                className="object-cover rounded-2xl"
              />
            </div>
          </article>

        </div>
      </div >
    </section >
  )
}