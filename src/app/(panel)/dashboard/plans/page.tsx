import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GridPlans } from "./_components/grid-plans";
import { getSubscriptions } from "@/utils/get-subscriptions";
import { SubscriptionDetail } from "./_components/subscription-detail";
import { subscriptionPlans } from "@/utils/plans";

export default async function Plans() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const subscription = await getSubscriptions({ userId: session.user.id! });

  return (
    <main className="space-y-10">
      <h1 className="text-lg text-center font-semibold">Escolha seu plano</h1>
      {subscription?.status !== "active" && (
        <GridPlans plansType={subscriptionPlans} />
      )}
      {subscription?.status === "active" && (
        <SubscriptionDetail subscription={subscription!} />
      )}
    </main>
  )
}