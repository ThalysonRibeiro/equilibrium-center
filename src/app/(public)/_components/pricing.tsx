import { subscriptionPlans } from "@/utils/plans";
import { GridPlans } from "./grid-plans";

export function Pricing() {
  return (
    <section
      id="price"
      className="bg-white h-auto py-6 px-6 sm:px-1 flex flex-col items-center justify-center gap-6"
      role="region"
      aria-labelledby="pricing-heading"
      aria-describedby="pricing-description"
    >
      <h2 id="pricing-heading" className="text-3xl text-center font-bold">
        Preços simples e transparentes
      </h2>
      <p id="pricing-description" className="text-center">
        Escolha o plano que se adapta ao tamanho e às necessidades do seu consultório. Todos os planos incluem recursos essenciais sem taxas ocultas.
      </p>

      <div
        className="max-w-6xl w-full"
        aria-label="Planos de assinatura disponíveis"
      >
        <GridPlans plansType={subscriptionPlans} />
      </div>
    </section>
  );
}
