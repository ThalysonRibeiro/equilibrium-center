"use server"

import { Plan } from "@/generated/prisma"
import { PlansProps } from "../plans"

export type PlanDetailsProps = {
  maxServices: number | typeof Infinity;
  reports?: string[];
  confirm_via_whatsapp?: boolean;
  download_PDF_reports?: boolean;
}

const PLANS_LIMITS: PlansProps = {
  BASIC: {
    maxServices: 3,
    reports: [
      "performanceCards",
      "barChartLastOfWeek",
    ],
    confirm_via_whatsapp: false,
    download_PDF_reports: false,
  },
  NORMAL: {
    maxServices: 30,
    reports: [
      "performanceCards",
      "barChartMultiple",
      "barChartLastOfWeek",
      "progressAppointments",
      "customerTable",
      "cardTotalINvoicing",
      "performanceContent",
    ],
    confirm_via_whatsapp: true,
    download_PDF_reports: false,
  },
  PROFESSIONAL: {
    maxServices: Infinity,
    reports: [
      "performanceCards",
      "barChartMultiple",
      "barChartLastOfWeek",
      "topCustomers",
      "topHours",
      "progressAppointments",
      "customerTable",
      "cardTotalINvoicing",
      "barChartLabel",
      "topServicesContent",
      "performanceContent",
    ],
    confirm_via_whatsapp: true,
    download_PDF_reports: true,
  },
  TRIAL: {
    maxServices: Infinity,
    reports: [
      "performanceCards",
      "barChartMultiple",
      "barChartLastOfWeek",
      "topCustomers",
      "topHours",
      "progressAppointments",
      "customerTable",
      "cardTotalINvoicing",
      "barChartLabel",
      "topServicesContent",
      "performanceContent",
    ],
    confirm_via_whatsapp: true,
    download_PDF_reports: true,
  }, // <- aqui copia as mesmas permissões
  EXPIRED: {
    maxServices: 0,
    reports: [],
    confirm_via_whatsapp: false,
    download_PDF_reports: false,
  },
}


export async function getPlan(planId: Plan) {
  return PLANS_LIMITS[planId]
}