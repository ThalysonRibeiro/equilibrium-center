"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod"


const formSchema = z.object({
  message: z.string()
    .min(1, { message: "A mensagem da avaliação é obrigatória" })
    .max(300, { message: "A mensagem deve ter no máximo 300 caracteres." }),
  rating: z.number()
    .int({ message: "A classificação deve ser um número inteiro" })
    .min(1, { message: "A classificação é obrigatória" })
    .max(5, { message: "A classificação deve ter no máximo 5" })
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateAssessment(formData: FormSchema) {
  const session = await auth();

  if (!session?.user.id) {
    return {
      error: "Usuário não encontrado"
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await prisma.assessments.update({
      where: { userId: session.user.id, },
      data: {
        userId: session.user.id,
        message: formData.message,
        rating: formData.rating,
      }
    });

    revalidatePath("/dashboard/profile");
    return {
      data: "Avaliação atualizada com sucesso!"
    }

  } catch (error) {
    console.log(error);

    return {
      error: "Erro ao atualizar avaliação"

    }

  }
}