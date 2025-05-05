"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod"
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  serviceId: z.string().min(1, { message: "O id do serviço é obrigatório" }),
  name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  price: z.string().min(1, { message: "O preço do serviço é obrigatório" }),
  duration: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateService(formData: FormSchema) {
  const session = await auth();
  if (!session?.user.id) {
    return {
      error: "Falha ao atualizar serviço"
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const priceDecimal = new Decimal(formData.price.replace(/\./g, '').replace(',', '.'));
  try {
    const service = await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session.user.id
      },
      data: {
        name: formData.name,
        price: priceDecimal,
        duration: formData.duration < 30 ? 30 : formData.duration
      }
    });

    // Converta o preço de Decimal para string ou number antes de retornar
    const serviceData = {
      ...service,
      price: service.price.toString(), // ou toNumber() se preferir number
    };

    revalidatePath("/dashboard/services");

    return {
      data: "Serviçoatualizado com sucesso!"
    }
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao atualizar serviço"
    }
  }
}

