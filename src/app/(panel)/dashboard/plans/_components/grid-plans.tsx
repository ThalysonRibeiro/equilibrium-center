"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { SubscriptionPlansProps } from "@/utils/plans";
import { SubscriptionButton } from "./subscription-button";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { StripePlan } from "@/utils/plans/plans";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GridPlansProps {
  plansType: SubscriptionPlansProps[];
}
type InvoicingType = "a_month" | "six_months" | "one_year";

export function GridPlans({ plansType }: GridPlansProps) {
  const [invoicingSelected, setInvoicingSelected] = useState<InvoicingType>("a_month");
  let startIndex: number = 0;
  let endIndex: number = 3;
  let period: string = "/mês";

  switch (invoicingSelected) {
    case "six_months":
      startIndex = 3
      endIndex = 6;
      period = "/semestral"
      break;
    case "one_year":
      startIndex = 6
      endIndex = 9;
      period = "/anual"
      break;
    default:
      startIndex = 0
      endIndex = 3;
      period = "/mês"
      break;
  }

  const invoicingPerPlans: SubscriptionPlansProps[] = plansType.slice(startIndex, endIndex);

  // Função para lidar com navegação por teclado nos botões de período
  const handleKeyDown = (event: React.KeyboardEvent, value: InvoicingType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setInvoicingSelected(value);
    }
  };

  return (
    <section aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="sr-only">
        Planos de Assinatura
      </h2>

      {/* Seletor de período de cobrança */}
      <div className="w-full flex justify-center mb-12">
        <div
          className="inline-flex items-center rounded-full gap-2 p-1 bg-gray-200 text-sm lg:text-base"
          role="tablist"
          aria-label="Selecione o período de cobrança"
        >
          <button
            id="a_month"
            role="tab"
            aria-selected={invoicingSelected === "a_month"}
            aria-controls="pricing-plans"
            onClick={() => setInvoicingSelected("a_month")}
            onKeyDown={(e) => handleKeyDown(e, "a_month")}
            className={cn(
              "p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              invoicingSelected === "a_month" && "bg-white text-accent border border-accent"
            )}
          >
            Mensal
          </button>
          <button
            id="six_months"
            role="tab"
            aria-selected={invoicingSelected === "six_months"}
            aria-controls="pricing-plans"
            onClick={() => setInvoicingSelected("six_months")}
            onKeyDown={(e) => handleKeyDown(e, "six_months")}
            className={cn(
              "p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              invoicingSelected === "six_months" && "bg-white text-accent border border-accent"
            )}
          >
            Semestral <span className="text-xs">(economize 10%)</span>
          </button>
          <button
            id="one_year"
            role="tab"
            aria-selected={invoicingSelected === "one_year"}
            aria-controls="pricing-plans"
            onClick={() => setInvoicingSelected("one_year")}
            onKeyDown={(e) => handleKeyDown(e, "one_year")}
            className={cn(
              "p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              invoicingSelected === "one_year" && "bg-white text-accent border border-accent"
            )}
          >
            Anual <span className="text-xs">(economize 20%)</span>
          </button>
        </div>
      </div>

      {/* Grade de planos */}
      <article
        id="pricing-plans"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 px-1 md:px-0"
        role="tabpanel"
        aria-labelledby={invoicingSelected}
      >
        {invoicingPerPlans.map((plan, index) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col w-full mx-auto md:hover:scale-105 transition-transform duration-300 shadow-md focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2",
              index === 1 && "md:scale-110 md:hover:scale-115",
              index === 1 ? "border border-accent" : "border-gray-200"
            )}
            role="article"
            aria-labelledby={`plan-title-${plan.id}`}
            aria-describedby={`plan-description-${plan.id}`}
          >
            {/* Badge para plano mais popular */}
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Mais Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle
                id={`plan-title-${plan.id}`}
                className="font-bold font-montserrat text-center"
              >
                {plan.name}
              </CardTitle>

              <div className="mt-4">
                {plan.oldPrice && (
                  <p className="text-gray-600 line-through text-lg" aria-label={`Preço anterior: ${plan.oldPrice}`}>
                    {plan.oldPrice}
                  </p>
                )}
                <p className="font-bold text-3xl" aria-label={`Preço atual: ${plan.price} ${period}`}>
                  <span aria-hidden="true">{plan.price}</span>
                  <span className="font-normal text-base text-gray-600" aria-hidden="true">
                    {period}
                  </span>
                </p>
              </div>

              <CardDescription
                id={`plan-description-${plan.id}`}
                className="text-center"
              >
                {plan.description}
              </CardDescription>

              <Separator className="bg-gray-200" role="separator" />
            </CardHeader>

            <CardContent className="mb-10">
              <h3 className="sr-only">Recursos inclusos no plano {plan.name}</h3>
              <ul role="list" aria-label={`Recursos do plano ${plan.name}`}>
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center gap-2 text-sm lg:text-base mb-2"
                    role="listitem"
                  >
                    <span
                      className="text-teal-600 flex-shrink-0"
                      aria-hidden="true"
                      role="img"
                      aria-label="Incluído"
                    >
                      <Check className="w-4 h-4" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="absolute bottom-5 w-full px-6">
              <SubscriptionButton
                type={plan.id as StripePlan}
                aria-label={`Assinar o plano ${plan.name} por ${plan.price} ${period}`}
              />
            </CardFooter>
          </Card>
        ))}
      </article>
    </section>
  )
}