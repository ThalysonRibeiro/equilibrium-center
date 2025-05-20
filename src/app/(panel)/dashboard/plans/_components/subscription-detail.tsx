"use client"
import { Subscription } from "@/generated/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPortalCustomer } from "../_actions/create-portal-customer";

interface SubscriptionDetailProps {
  subscription: Subscription;
}

export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {

  const subscriptionInfo = subscriptionPlans.find(plan => plan.id === subscription.plan);

  const activeFeaturesCount = subscription.plan === "BASIC" ? 3
    : subscription.plan === "NORMAL" ? 4
      : 6

  async function handleManageSubscription() {
    const portal = await createPortalCustomer();
    if (portal.error) {
      toast.error("Ocorreu um erro ao criar protal de assionatura.")
    }

    window.location.href = portal.sessionId;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="font-montserrat text-2xl">
          Plano atual
        </CardTitle>
        <CardDescription>Sua assinatura está ativa</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-montserrat text-xl">
            {subscription.plan === "BASIC" ? "Básico"
              : subscription.plan === "NORMAL" ? "Normal"
                : "Profissional"}
          </h3>
          <div className="bg-green-500 text-white px-2 py-1 rounded">
            {subscription.status === "active" ? "ATIVO" : "INATIVO"}
          </div>
        </div>
        <ul className="space-y-2 list-disc mx-4">
          {subscriptionInfo && subscriptionInfo.features.map((feature, index) => (
            <li
              key={feature}
              className={`${index <= activeFeaturesCount ? "text-primary" : "text-gray-600 line-through"}`}
            >
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleManageSubscription}
          className="hover:bg-accent"
        >
          Gerenciar assinatura
        </Button>
      </CardFooter>
    </Card>
  )
}