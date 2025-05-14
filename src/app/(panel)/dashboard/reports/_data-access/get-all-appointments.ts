import prisma from "@/lib/prisma";

export async function getAllAppointments(userId: string, start: Date, end: Date) {
  return prisma.appointment.findMany({
    where: {
      userId: userId,
      status: 'COMPLETED',
      appointmentDate: {
        gte: start,
        lte: end,
      },
    },
    include: {
      service: {
        select: {
          name: true,
          price: true,
          duration: true,
        }
      }
    },
    orderBy: {
      appointmentDate: 'desc',
    },
  });
}