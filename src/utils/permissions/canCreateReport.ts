"use server"

import { Subscription } from "@/generated/prisma";
import { getPlan } from "./get-plans";
import { PLANS } from "../plans";
import { ResultPermissionProps } from "./canPermission";


export async function canCreateReport(subscription: Subscription | null): Promise<ResultPermissionProps> {
  if (subscription && subscription.status === "active") {
    const plan = subscription.plan;
    const planLimits = await getPlan(plan);
    const maxReports = planLimits.reports;


    return {
      hasPermission: planLimits.reports?.length! > 0!,
      planId: subscription.plan,
      expired: false,
      plan: PLANS[subscription.plan],
      limitReport: maxReports || []
    }
  } else {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
      limitReport: []
    }
  }

}