"use server"
import prisma from "@/lib/prisma";

export async function getListHoursData() {
  try {
    const listHours = await prisma.schedules.findFirst({
      include: {
        Hours: {
          select: {
            id: true,
            time: true
          }
        }
      }
    });

    if (!listHours) return null;  // Se não houver horas, retornamos null

    return listHours;

  } catch (error) {
    console.log(error);
    return null
  }
}