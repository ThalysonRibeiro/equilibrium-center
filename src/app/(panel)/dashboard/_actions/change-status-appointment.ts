"use server"

import { AppointmentStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  appointmentId: z.string().min(1, "Você precisa fornecer uma gendamento"),
  status: z.string().min(1, "Você precisa o status do gendamento"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function changeStatusAppointment(formData: FormSchema) {
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

  let statusAppointment: AppointmentStatus;

  switch (formData.status.toUpperCase()) {
    case "SCHEDULED":
      statusAppointment = "SCHEDULED";
      break;
    case "COMPLETED":
      statusAppointment = "COMPLETED";
      break;
    case "NO_SHOW":
      statusAppointment = "NO_SHOW";
      break;
    case "CANCELLED":
      statusAppointment = "CANCELLED";
      break;

    default:
      statusAppointment = "PENDING";
      break;
  }

  try {
    await prisma.appointment.update({
      where: {
        id: formData.appointmentId,
        userId: session?.user?.id
      },
      data: {
        status: statusAppointment
      }
    });

    revalidatePath("/dashboard");

    return {
      data: "Agendamenmto atualizado com sucesso"
    }
  } catch (error) {
    return {
      error: "Ocorreu um erro ao atualiozar este agendamento"
    }
  }

}