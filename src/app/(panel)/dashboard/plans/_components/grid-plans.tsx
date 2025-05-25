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

interface GridPlansProps {
  plansType: SubscriptionPlansProps[];
}

export function GridPlans({ plansType }: GridPlansProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 px-10 md:px-0">
      {plansType.map((plan, index) => (
        <Card key={plan.id}
          className={`relative flex flex-col w-full mx-auto  hover:scale-105 transition-transform duration-300
          ${index === 1 && "scale-110 hover:scale-115 pt-0"}
          ${index === 1 && "border border-blue-500"}`}
        >
          {index === 1 && (
            <div className="bg-gradient-to-br from-primary to-cyan-500 text-white py-3 text-center rounded-t-xl">
              <p className="font-montserrat uppercase">
                Mais popular
              </p>
            </div>
          )}
          <CardHeader>
            <CardTitle className="font-extrabold font-montserrat text-center">
              {plan.name}
            </CardTitle>
            <CardDescription className="text-center">
              {plan.description}
            </CardDescription>
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
            <div className="mt-4">
              <p className="text-gray-600 line-through text-lg">{plan.oldPrice}</p>
              <p className="text-primary font-black text-3xl">{plan.price}</p>
            </div>
          </CardContent>
          <CardFooter className="absolute bottom-5 w-full">
            <SubscriptionButton
              type={plan.id === "BASIC" ? "BASIC"
                : plan.id === "NORMAL" ? "NORMAL"
                  : "PROFESSIONAL"}
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}