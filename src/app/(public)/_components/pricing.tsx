import { subscriptionPlans } from "@/utils/plans";
import { GridPlans } from "./grid-plans";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="price" className="bg-white h-auto py-6 px-6 sm:px-1 flex flex-col items-center justify-center gap-6">
      <h2 className="text-primary text-3xl text-center font-bold">
        Preços simples e transparentes
      </h2>
      <p className="text-center">
        Escolha o plano que se adapta ao tamanho e às necessidades do seu consultório. Todos os planos incluem recursos essenciais sem taxas ocultas.
      </p>

      <div className="max-w-6xl w-full">
        <GridPlans plansType={subscriptionPlans} />
      </div>
    </section>
  )
}