"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canCreateService } from "./canCreateService";
import { PlanDetailsProps } from "./get-plans";
import { canCreateReport } from "./canCreateReport";
import { canUseWhatsapp } from "./canUseWhatsapp";
import { canUseDownloadPdf } from "./canUseDownloadPdf";

export type PLAN_PROP = "BASIC" | "NORMAL" | "PROFESSIONAL" | "TRIAL" | "EXPIRED";
export type TypeCheck = "service" | "report" | "whatsapp" | "download_pdf";

export interface ResultPermissionProps {
  hasPermission: boolean;
  planId: PLAN_PROP;
  expired: boolean
  plan: PlanDetailsProps | null;
  // Adicionar mais info para debugging/UI
  limitReport?: string[];
  // confirm?: boolean;
}

interface CanPermissionProps {
  type: TypeCheck;
}

export async function canPermission({ type }: CanPermissionProps): Promise<ResultPermissionProps> {
  const session = await auth();

  if (!session?.user.id) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null
    }
  }
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session?.user.id,
    }
  });

  // Centralizar lógica de verificação
  switch (type) {
    case "service":
      return await canCreateService(subscription, session);

    case "report":
      return await canCreateReport(subscription);

    case "whatsapp":
      return await canUseWhatsapp(subscription);

    case "download_pdf":
      return await canUseDownloadPdf(subscription);

    default:
      // Tipo não reconhecido
      return {
        hasPermission: false,
        planId: "EXPIRED",
        expired: true,
        plan: null,
        limitReport: [],
      };
  }


}