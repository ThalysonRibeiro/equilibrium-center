"use server"

import { Subscription } from "@/generated/prisma";
import { getPlan } from "./get-plans";
import { PLANS } from "../plans";
import { ResultPermissionProps } from "./canPermission";


export async function canUseWhatsapp(subscription: Subscription | null): Promise<ResultPermissionProps> {
  if (subscription && subscription.status === "active") {
    const plan = subscription.plan;
    const planLimits = await getPlan(plan);



    return {
      hasPermission: planLimits.confirm_via_whatsapp!,
      planId: subscription.plan,
      expired: false,
      plan: PLANS[subscription.plan],
    }
  } else {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
      limitReport: [],
    }
  }
}