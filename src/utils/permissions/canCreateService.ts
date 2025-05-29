// "use server"

// import { Subscription } from "@/generated/prisma";
// import prisma from "@/lib/prisma";
// import { Session } from "next-auth";
// import { getPlan } from "./get-plans";
// import { PLANS } from "../plans";
// import { checkSubscriptionExpired } from "./checkSubscriptionExpired";
// import { ResultPermissionProps } from "./canPermission";

// export async function canCreateService(subscription: Subscription | null, session: Session): Promise<ResultPermissionProps> {
//   try {
//     const serviceCount = await prisma.service.count({
//       where: {
//         userId: session.user.id
//       }
//     });

//     if (subscription && subscription.status === "active") {
//       const plan = subscription.plan;
//       const planLimits = await getPlan(plan);
//       return {
//         hasPermission: planLimits.maxServices === Infinity || serviceCount <= planLimits.maxServices,
//         planId: subscription.plan,
//         expired: false,
//         plan: PLANS[subscription.plan],
//       }
//     }

//     const checkTestLimit = await checkSubscriptionExpired(session);

//     return checkTestLimit;

//   } catch (error) {
//     return {
//       hasPermission: false,
//       planId: "EXPIRED",
//       expired: true,
//       plan: null,
//       limitReport: [],
//     }
//   }
// }

"use server";

import prisma from "@/lib/prisma";
import { getPlan } from "./get-plans";
import { PLAN_PROP, ResultPermissionProps } from "./canPermission";

export async function canCreateService(userId: string, planId: PLAN_PROP): Promise<ResultPermissionProps> {
  try {
    const serviceCount = await prisma.service.count({
      where: { userId }
    });

    const planLimits = await getPlan(planId);

    const hasPermission =
      planLimits.maxServices === Infinity || serviceCount < planLimits.maxServices;

    return {
      hasPermission,
      planId,
      expired: planId === "EXPIRED",
      plan: planLimits,
    };
  } catch (error) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
      limitReport: [],
    };
  }
}
