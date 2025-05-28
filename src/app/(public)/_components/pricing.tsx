import { subscriptionPlans } from "@/utils/plans";
import { GridPlans } from "./grid-plans";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section className="bg-white h-auto py-6 px-6 sm:px-1 flex flex-col items-center justify-center gap-6">
      <h2 className="text-primary text-3xl text-center font-bold">
        Preços simples e transparentes
      </h2>
      <p className="text-center">
        Escolha o plano que se adapta ao tamanho e às necessidades do seu consultório. Todos os planos incluem recursos essenciais sem taxas ocultas.
      </p>
      <div className="inline-flex items-center rounded-full p-1 bg-gray-200">
        <span className="py-2 px-4 rounded-full bg-white shadow-sm text-ring font-medium">
          Faturamento Mensal
        </span>
        <span className="py-2 px-4 text-gray-700">
          Faturamento anual (economize  20%)
        </span>
      </div>

      <div className="max-w-6xl w-full">
        <GridPlans plansType={subscriptionPlans} />
      </div>

      <div className="max-w-4xl mt-16 bg-white rounded-xl shadow-sm p-8 border border-gray-200 mx-4">
        <h3 className="text-xl font-semibold text-primary mb-4 text-center">
          Precisa de uma solução personalizada para uma clínica maior?
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Oferecemos planos empresariais personalizados para clínicas com necessidades especiais ou mais de 10 profissionais
        </p>
        <div className="text-center">
          <Button className="hover:bg-accent">
            Entre em contato com nossa equipe de vendas
          </Button>
        </div>
      </div>
    </section>
  )
}