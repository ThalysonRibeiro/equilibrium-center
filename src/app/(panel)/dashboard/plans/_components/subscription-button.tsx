"use client"
import { Button } from "@/components/ui/button";
import { Plan } from "@/generated/prisma";
import { createSubscription } from "../_actions/create-subscriptions";
import { toast } from "sonner";
import { getStripeJs } from "@/utils/stripe-js";

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  async function handleCreateBilling() {
    const { sessionId, error } = await createSubscription({ type: type });
    if (error) {
      toast.error(error)
      return;
    }
    const stripe = await getStripeJs();
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: sessionId! })
    }
  }

  return (
    <Button
      variant={"ghost"}
      className={`${type === "NORMAL" ? "bg-accent text-white" : "text-accent border border-accent"} cursor-pointer w-full`}
      onClick={handleCreateBilling}
    >
      Assinar
    </Button>
  )
}