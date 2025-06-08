"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SubscriptionPlansProps } from "@/utils/plans";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

interface GridPlansProps {
  plansType: SubscriptionPlansProps[];
}
type InvoicingType = "a_month" | "six_months" | "one_year";

export function GridPlans({ plansType }: GridPlansProps) {
  const [invoicingSelected, setInvoicingSelected] = useState<InvoicingType>("a_month");

  let startIndex: number = 0;
  let endIndex: number = 3;
  let period: string = "/mês";
  let periodLabel: string = "por mês";

  switch (invoicingSelected) {
    case "six_months":
      startIndex = 3;
      endIndex = 6;
      period = "/semestral";
      periodLabel = "por semestre";
      break;
    case "one_year":
      startIndex = 6;
      endIndex = 9;
      period = "/anual";
      periodLabel = "por ano";
      break;
    default:
      startIndex = 0;
      endIndex = 3;
      period = "/mês";
      periodLabel = "por mês";
      break;
  }

  const invoicingPerPlans: SubscriptionPlansProps[] = plansType.slice(startIndex, endIndex);

  const handleInvoicingChange = (type: InvoicingType) => {
    setInvoicingSelected(type);
  };

  const getInvoicingLabel = (type: InvoicingType) => {
    switch (type) {
      case "a_month":
        return "Cobrança mensal";
      case "six_months":
        return "Cobrança semestral com 10% de desconto";
      case "one_year":
        return "Cobrança anual com 20% de desconto";
      default:
        return "";
    }
  };

  return (
    <section
      className="max-w-7xl mx-auto"
      role="region"
      aria-labelledby="plans-heading"
    >
      <header className="sr-only">
        <h2 id="plans-heading">Planos de assinatura disponíveis</h2>
      </header>

      <div className="w-full flex justify-center mb-12">
        <fieldset className="inline-flex items-center rounded-full gap-2 p-1 bg-gray-200 text-sm lg:text-base">
          <legend className="sr-only">Selecione o período de cobrança</legend>

          <button
            type="button"
            onClick={() => handleInvoicingChange("a_month")}
            className={cn(
              "p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              invoicingSelected === "a_month" && "bg-white text-accent border border-accent"
            )}
            aria-pressed={invoicingSelected === "a_month"}
            aria-label={getInvoicingLabel("a_month")}
          >
            Mensal
          </button>

          <button
            type="button"
            onClick={() => handleInvoicingChange("six_months")}
            className={cn(
              "p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              invoicingSelected === "six_months" && "bg-white text-accent border border-accent"
            )}
            aria-pressed={invoicingSelected === "six_months"}
            aria-label={getInvoicingLabel("six_months")}
          >
            Semestral <span className="text-xs">(economize 10%)</span>
          </button>

          <button
            type="button"
            onClick={() => handleInvoicingChange("one_year")}
            className={cn(
              "p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              invoicingSelected === "one_year" && "bg-white text-accent border border-accent"
            )}
            aria-pressed={invoicingSelected === "one_year"}
            aria-label={getInvoicingLabel("one_year")}
          >
            Anual <span className="text-xs">(economize 20%)</span>
          </button>
        </fieldset>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-15 mx-auto px-4 my-6"
        role="list"
        aria-label={`Planos disponíveis com cobrança ${periodLabel}`}
      >
        {invoicingPerPlans.map((plan, index) => {
          const isPopular = index === 1;
          const isDiscounted = plan.oldPrice && plan.oldPrice !== plan.price;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col w-full mx-auto md:hover:scale-105 transition-transform duration-300 shadow-md focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2",
                isPopular && "md:scale-110 md:hover:scale-115",
                isPopular ? "border border-accent" : "border-gray-200"
              )}
              role="listitem"
              aria-labelledby={`plan-title-${plan.id}`}
              aria-describedby={`plan-description-${plan.id} plan-price-${plan.id}`}
            >
              {isPopular && (
                <div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium"
                  role="banner"
                  aria-label="Plano mais popular"
                >
                  Mais Popular
                </div>
              )}

              <CardHeader>
                <CardTitle
                  id={`plan-title-${plan.id}`}
                  className="font-bold font-montserrat text-center"
                >
                  {plan.name}
                </CardTitle>

                <div className="mt-4" id={`plan-price-${plan.id}`}>
                  {isDiscounted && (
                    <p
                      className="text-gray-600 line-through text-lg"
                      aria-label={`Preço anterior: ${plan.oldPrice} ${periodLabel}`}
                    >
                      {plan.oldPrice}
                    </p>
                  )}
                  <p className="font-bold text-3xl">
                    <span aria-label={`Preço atual: ${plan.price} ${periodLabel}`}>
                      {plan.price}
                    </span>
                    <span
                      className="font-normal text-base text-gray-600 ml-1"
                      aria-hidden="true"
                    >
                      {period}
                    </span>
                  </p>
                  {isDiscounted && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {invoicingSelected === "a_month" ? "" : invoicingSelected === "six_months" ? "10% de desconto" : "20% de desconto"}
                    </p>
                  )}
                </div>

                <CardDescription
                  id={`plan-description-${plan.id}`}
                  className="text-center"
                >
                  {plan.description}
                </CardDescription>

                <Separator className="bg-gray-200" role="presentation" />
              </CardHeader>

              <CardContent className="mb-10">
                <h3 className="sr-only">Recursos inclusos no plano {plan.name}</h3>
                <ul
                  className="space-y-2"
                  role="list"
                  aria-label={`Recursos do plano ${plan.name}`}
                >
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm lg:text-base"
                      role="listitem"
                    >
                      <span
                        className="text-teal-600 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Check className="w-4 h-4" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="absolute bottom-5 w-full px-6">
                <Button
                  onClick={() => redirect("/login")}
                  variant="ghost"
                  className={cn(
                    "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isPopular
                      ? "bg-accent text-white hover:bg-accent/90 focus:ring-accent"
                      : "text-accent border border-accent hover:bg-accent hover:text-white focus:ring-accent"
                  )}
                  aria-label={`Iniciar teste gratuito do plano ${plan.name} - ${plan.price} ${periodLabel}`}
                >
                  Iniciar teste gratuito
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="sr-only" aria-live="polite" id="plan-change-announcement">
        Exibindo planos com cobrança {periodLabel}
      </div>
    </section>
  )
}