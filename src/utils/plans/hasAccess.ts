"use server"

import { Plan } from "@/generated/prisma";
import { getPlan } from "../permissions/get-plans";

export async function hasAccess(plan: Plan, feature: string) {
  const FEATURES_BY_PLAN = await getPlan(plan);
  return FEATURES_BY_PLAN.reports?.includes(feature) ?? false;
}