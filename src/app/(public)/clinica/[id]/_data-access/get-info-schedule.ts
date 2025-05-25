"use server"

import prisma from "@/lib/prisma";

export async function getInfoSchedule({ userId }: { userId: string }) {
  try {
    if (!userId) return null;

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        subscription: true,
        service: {
          where: {
            status: true
          }
        }
      }
    });

    if (!user) return null;

    // Converte o price para string em cada serviço
    const servicesWithStringPrice = user.service.map(service => ({
      ...service,
      price: service.price.toString()
    }));

    // Retorna o user completo com os serviços ajustados
    return {
      ...user,
      service: servicesWithStringPrice
    };

  } catch (error) {
    console.log(error);

  }
}