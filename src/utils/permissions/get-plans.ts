"use server"

import { PlansProps } from "../plans"

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
    reports: 3,
    confirm_via_whatsapp: false,
    download_PDF_reports: false,
  },
  NORMAL: {
    maxServices: 30,
    reports: 6,
    confirm_via_whatsapp: true,
    download_PDF_reports: false,
  },
  PROFESSIONAL: {
    maxServices: Infinity,
    reports: Infinity,
    confirm_via_whatsapp: true,
    download_PDF_reports: true,
  }
}