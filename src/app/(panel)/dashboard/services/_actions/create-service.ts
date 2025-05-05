"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod"
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  price: z.string().min(1, { message: "O preço é obrigatório" }),
  duration: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createNewService(formData: FormSchema) {
  const session = await auth();
  if (!session?.user.id) {
    return {
      error: "Falha ao cadastrar serviço"
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
    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        price: priceDecimal,
        duration: formData.duration,
        userId: session?.user.id
      }
    });

    // Converta o preço de Decimal para string ou number antes de retornar
    const serviceData = {
      ...newService,
      price: newService.price.toString(), // ou toNumber() se preferir number
    };

    revalidatePath("/dashboard/services");

    return {
      data: serviceData
    }
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao cadastrar serviço"
    }
  }
}