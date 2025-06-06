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

  return (
    <section>

      <div className="w-full flex justify-center mb-12">
        <div className="inline-flex items-center rounded-full gap-2 p-1 bg-gray-200 text-sm lg:text-base">
          <button
            id="a_month"
            onClick={() => setInvoicingSelected("a_month")}
            className={cn("p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full",
              invoicingSelected === "a_month" && "bg-white text-accent border border-accent"
            )}
          >
            Mensal
          </button>
          <button
            id="six_months"
            onClick={() => setInvoicingSelected("six_months")}
            className={cn("p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full",
              invoicingSelected === "six_months" && "bg-white text-accent border border-accent"
            )}
          >
            Semestral (economize 10%)
          </button>
          <button
            id="one_year"
            onClick={() => setInvoicingSelected("one_year")}
            className={cn("p-2 text-gray-700 transition-all duration-300 hover:bg-white hover:text-accent rounded-full",
              invoicingSelected === "one_year" && "bg-white text-accent border border-accent"
            )}
          >
            Anual (economize 20%)
          </button>
        </div>
      </div>

      <article className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-15 mx-auto px-4 my-6">
        {invoicingPerPlans.map((plan, index) => (
          <Card key={plan.id}
            className={`relative flex flex-col w-full mx-auto md:hover:scale-105 transition-transform duration-300 shadow-md
          ${index === 1 && "md:scale-110 md:hover:scale-115 "}
          ${index === 1 ? "border border-accent" : "border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className="font-bold font-montserrat text-center">
                {plan.name}
              </CardTitle>
              <div className="mt-4">
                <p className="text-gray-600 line-through text-lg">{plan.oldPrice}</p>
                <p className="font-bold text-3xl">{plan.price} <span className="font-normal text-base text-gray-600">{period}</span></p>
              </div>
              <CardDescription className="text-center">
                {plan.description}
              </CardDescription>
              <Separator className="bg-gray-200" />
            </CardHeader>
            <CardContent className="mb-10">
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm lg:text-base">
                    <span className="text-teal-600">
                      <Check className="w-4 h-4" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

            </CardContent>
            <CardFooter className="absolute bottom-5 w-full">
              <Button
                onClick={() => redirect("/login")}
                variant={"ghost"}
                className={`${index === 1 ? "bg-accent text-white" : "text-accent border border-accent"} w-full`}
              >
                Iniciar teste gratuito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </article>
    </section>
  )
}