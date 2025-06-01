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
import { SubscriptionPlansProps } from "@/utils/plans";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

interface GridPlansProps {
  plansType: SubscriptionPlansProps[];
}

export function GridPlans({ plansType }: GridPlansProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-15 mx-auto px-4 my-6">
      {plansType.map((plan, index) => (
        <Card key={plan.id}
          className={`relative flex flex-col w-full mx-auto md:hover:scale-105 transition-transform duration-300 shadow-md
          ${index === 1 && "md:scale-110 md:hover:scale-115 "}
          ${index === 1 ? "border border-ring" : "border-gray-200"}`}
        >
          <CardHeader>
            <CardTitle className="font-bold font-montserrat text-center">
              {plan.name}
            </CardTitle>
            <div className="mt-4">
              <p className="text-gray-600 line-through text-lg">{plan.oldPrice}</p>
              <p className="text-primary font-bold text-3xl">{plan.price} <span className="font-normal text-base text-gray-600">/mês</span></p>
            </div>
            <CardDescription className="text-center">
              {plan.description}
            </CardDescription>
            <Separator className="bg-gray-200" />
          </CardHeader>
          <CardContent className="mb-10">
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm lg:text-base">
                  <span className="text-blue-600">
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
              className={`${index === 1 ? "bg-ring text-white" : "hover:bg-transparent hover:text-ring border border-ring"} w-full`}
            >
              Iniciar teste gratuito
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}