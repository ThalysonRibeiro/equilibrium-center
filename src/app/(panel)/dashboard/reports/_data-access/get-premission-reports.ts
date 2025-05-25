"use server"
import { Plan } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getPermissionReports({ userId, planId }: { userId: string, planId?: Plan }) {

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    }
  });

  if (
    !user?.subscription
    // || user.subscription.plan !== planId
  ) return null;

  return user;
}