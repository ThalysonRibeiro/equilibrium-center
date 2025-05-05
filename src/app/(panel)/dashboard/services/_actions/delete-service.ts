"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { date, z } from "zod"
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  serviceId: z.string().min(1, { message: "O nome é obrigatório" }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteService(formData: FormSchema) {
  const session = await auth();
  if (!session?.user.id) {
    return {
      error: "Falha ao desativar serviço"
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session.user.id
      },
      data: {
        status: false
      }
    });
    revalidatePath("/dashboard/services");
    return {
      data: "Servoço desativado com sucesso!"
    }
  } catch (error) {
    console.log();
    return {
      error: "Falha ao desativar serviço"
    }
  }

}