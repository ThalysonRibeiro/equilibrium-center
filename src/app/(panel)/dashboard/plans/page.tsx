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
    <div>
      {subscription?.status !== "active" && (
        <GridPlans plansType={subscriptionPlans} />
      )}
      {subscription?.status === "active" && (
        <SubscriptionDetail subscription={subscription!} />
      )}
    </div>
  )
}