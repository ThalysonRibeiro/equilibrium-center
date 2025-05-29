// "use server"

// import prisma from "@/lib/prisma"
// import { addDays, differenceInDays, isAfter } from "date-fns";
// import { TRIAL_DAYS } from "./trial-limits";

// export async function checkSubscription(userId: string) {
//   const user = await prisma.user.findFirst({
//     where: {
//       id: userId,
//     },
//     include: {
//       subscription: true
//     }
//   });
//   if (!user) {
//     throw new Error("Usuário não encontrado.");
//   }
//   if (user.subscription && user.subscription.status === "active") {
//     return {
//       subscriptionStatus: "active",
//       message: "Assinatura ativa.",
//       planId: user.subscription.plan,
//     }
//   }

//   const trialEndDate = addDays(user.createdAt, TRIAL_DAYS);
//   if (isAfter(new Date(), trialEndDate)) {
//     return {
//       subscriptionStatus: "EXPIRED",
//       message: "Seu período de teste expirou.",
//       planId: "EXPIRED",
//     }
//   }

//   const daysRemaining = differenceInDays(trialEndDate, new Date());

//   return {
//     subscriptionStatus: "TRIAL",
//     message: `Você está no período de teste gratuito. Faltam ${daysRemaining} dias`,
//     planId: "TRIAL",
//   }
// }

"use server"

import prisma from "@/lib/prisma";
import { addDays, differenceInDays, isAfter } from "date-fns";
import { TRIAL_DAYS } from "./trial-limits";

export async function checkSubscription(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  let { plan, createdAt } = user;

  if (plan === "TRIAL") {
    const trialEndDate = addDays(createdAt, TRIAL_DAYS);

    if (isAfter(new Date(), trialEndDate)) {
      // ✅ Atualiza plano no banco para "EXPIRED"
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: "EXPIRED" },
      });

      return {
        subscriptionStatus: "EXPIRED",
        message: "Seu período de teste expirou.",
        planId: "EXPIRED",
        trialEndDate,
      };
    }

    const daysRemaining = differenceInDays(trialEndDate, new Date());

    return {
      subscriptionStatus: "TRIAL",
      message: `Você está no período de teste gratuito. Faltam ${daysRemaining} dias.`,
      planId: "TRIAL",
      trialEndDate,
    };
  }

  if (plan === "EXPIRED") {
    return {
      subscriptionStatus: "EXPIRED",
      message: "Assinatura expirada.",
      planId: "EXPIRED",
    };
  }

  // Planos pagos
  return {
    subscriptionStatus: "active",
    message: "Assinatura ativa.",
    planId: plan,
  };
}
