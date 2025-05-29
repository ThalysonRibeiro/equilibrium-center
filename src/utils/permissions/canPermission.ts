// "use server"

// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { canCreateService } from "./canCreateService";
// import { PlanDetailsProps } from "./get-plans";
// import { canCreateReport } from "./canCreateReport";
// import { canUseWhatsapp } from "./canUseWhatsapp";
// import { canUseDownloadPdf } from "./canUseDownloadPdf";

// export type PLAN_PROP = "BASIC" | "NORMAL" | "PROFESSIONAL" | "TRIAL" | "EXPIRED";
// export type TypeCheck = "service" | "report" | "whatsapp" | "download_pdf";

// export interface ResultPermissionProps {
//   hasPermission: boolean;
//   planId: PLAN_PROP;
//   expired: boolean
//   plan: PlanDetailsProps | null;
//   limitReport?: string[];
// }

// interface CanPermissionProps {
//   type: TypeCheck;
// }

// export async function canPermission({ type }: CanPermissionProps): Promise<ResultPermissionProps> {
//   const session = await auth();

//   if (!session?.user.id) {
//     return {
//       hasPermission: false,
//       planId: "EXPIRED",
//       expired: true,
//       plan: null
//     }
//   }
//   const subscription = await prisma.subscription.findFirst({
//     where: {
//       userId: session?.user.id,
//     }
//   });

//   // Centralizar lógica de verificação
//   switch (type) {
//     case "service":
//       return await canCreateService(subscription, session);

//     case "report":
//       return await canCreateReport(subscription);

//     case "whatsapp":
//       return await canUseWhatsapp(subscription);

//     case "download_pdf":
//       return await canUseDownloadPdf(subscription);

//     default:
//       // Tipo não reconhecido
//       return {
//         hasPermission: false,
//         planId: "EXPIRED",
//         expired: true,
//         plan: null,
//         limitReport: [],
//       };
//   }
// }

"use server";

import { auth } from "@/lib/auth";
import { getPlan } from "./get-plans";
import { PlanDetailsProps } from "./get-plans";
import { canCreateService } from "./canCreateService";
import prisma from "@/lib/prisma";

export type PLAN_PROP = "BASIC" | "NORMAL" | "PROFESSIONAL" | "TRIAL" | "EXPIRED";
export type TypeCheck = "service" | "report" | "whatsapp" | "download_pdf";

export interface ResultPermissionProps {
  hasPermission: boolean;
  planId: PLAN_PROP;
  expired: boolean;
  plan: PlanDetailsProps | null;
  limitReport?: string[];
}

interface CanPermissionProps {
  type: TypeCheck;
}

export async function canPermission({ type }: CanPermissionProps): Promise<ResultPermissionProps> {
  const session = await auth();

  if (!session?.user.id || !session.user.plan) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  const planId = session.user.plan as PLAN_PROP;
  const plan = await getPlan(planId);

  let hasPermission = false;

  switch (type) {
    case "service":
      const serviceCount = await prisma.service.count({ where: { userId: session.user.id } });
      hasPermission = plan.maxServices === Infinity || serviceCount < plan.maxServices;
      break;

    case "report":
      hasPermission = (plan.reports?.length || 0) > 0;
      break;

    case "whatsapp":
      hasPermission = !!plan.confirm_via_whatsapp;
      break;

    case "download_pdf":
      hasPermission = !!plan.download_PDF_reports;
      break;

    default:
      hasPermission = false;
  }

  return {
    hasPermission,
    planId,
    expired: planId === "EXPIRED",
    plan,
    limitReport: plan.reports || [],
  };
}
