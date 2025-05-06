"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { z } from "zod"

const formSchema = z.object({
  appointmentId: z.string().min(1, "Você precisa fornecer uma gendamento")
});

type FormSchema = z.infer<typeof formSchema>;

export async function cancelAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0]?.message
    }
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Ususário não encontrado"
    }
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: formData.appointmentId,
        userId: session?.user?.id
      }
    });

    return {
      data: "Agendamenmto cancelado com sucesso"
    }
  } catch (error) {
    return {
      error: "Ocorreu um erro ao deletar este agendamento"
    }
  }

}