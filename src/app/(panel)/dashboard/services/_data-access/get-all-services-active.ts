"use server"

import prisma from "@/lib/prisma";


export async function getAllServicesActive({ userId }: { userId: string }) {
  if (!userId) {
    return {
      error: "Falha ao buscar servoços"
    }
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        userId: userId,
        status: true
      }
    });

    // Converter todos os valores 'Decimal' para 'string' ou 'number'
    const servicesData = services.map(service => ({
      ...service,
      price: service.price.toString(), // ou .toNumber() se preferir número
    }));
    return {
      data: servicesData
    }
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao buscar servoços"
    }
  }
}