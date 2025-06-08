"use client"

import { Button } from "@/components/ui/button"
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits"
import { redirect } from "next/navigation"

export function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-ring text-white py-12 sm:px-4 flex flex-col items-center justify-center gap-8"
    >
      <div className="container mx-auto px-6 space-y-6 max-w-3xl">
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl text-center font-bold"
        >
          Pronto para elevar sua prática de massoterapia?
        </h2>
        <p className="text-center text-white/90">
          Junte-se a milhares de terapeutas que transformaram suas práticas com o Equilibrium Center. Comece seu teste gratuito hoje mesmo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => redirect("/login")}
            variant="outline"
            size="lg"
            aria-label="Começar o teste gratuito de 15 dias sem necessidade de cartão de crédito"
            className="border-white bg-white text-teal-700 hover:bg-teal-600 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
          >
            Comece seu teste gratuito
          </Button>
        </div>

        <p className="text-center text-white/80">
          Não é necessário cartão de crédito. Teste grátis por {TRIAL_DAYS} dias.
        </p>
      </div>
    </section>
  )
}
