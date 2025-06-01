"use server"

import prisma from "@/lib/prisma";

export async function getProfessionals() {
  try {
    const professionals = await prisma.user.findMany({
      where: {
        status: true,
      },
      include: {
        service: {
          where: {
            status: true
          },
          select: {
            name: true
          }
        }
      },
      orderBy: {
        plan: "asc"
      }
    });

    return professionals;

  } catch (error) {
    return [];
  }
}