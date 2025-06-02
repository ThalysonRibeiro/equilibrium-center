import { Plan } from "@/generated/prisma";

export const planMap = {
  BASIC: process.env.STRIPE_PLAN_BASIC,
  BASIC6: process.env.STRIPE_PLAN_BASIC6,
  BASIC12: process.env.STRIPE_PLAN_BASIC12,
  NORMAL: process.env.STRIPE_PLAN_NORMAL,
  NORMAL6: process.env.STRIPE_PLAN_NORMAL6,
  NORMAL12: process.env.STRIPE_PLAN_NORMAL12,
  PROFESSIONAL: process.env.STRIPE_PLAN_PROFESSIONAL,
  PROFESSIONAL6: process.env.STRIPE_PLAN_PROFESSIONAL6,
  PROFESSIONAL12: process.env.STRIPE_PLAN_PROFESSIONAL12,
  CUSTOM: process.env.STRIPE_PLAN_CUSTOM,
} as const;

export type StripePlan = keyof typeof planMap;

export const stripeToDatabasePlan: Record<StripePlan, Plan> = {
  BASIC: "BASIC",
  BASIC6: "BASIC",
  BASIC12: "BASIC",
  NORMAL: "NORMAL",
  NORMAL6: "NORMAL",
  NORMAL12: "NORMAL",
  PROFESSIONAL: "PROFESSIONAL",
  PROFESSIONAL6: "PROFESSIONAL",
  PROFESSIONAL12: "PROFESSIONAL",
  CUSTOM: "PROFESSIONAL", // ajuste se quiser
};
