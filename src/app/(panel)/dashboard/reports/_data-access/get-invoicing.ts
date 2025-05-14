import prisma from "@/lib/prisma";

export async function getAllCompletedAppointments(userId: string) {
  return prisma.appointment.findMany({
    where: {
      userId: userId,
      status: 'COMPLETED'
    },
    include: {
      service: {
        select: {
          price: true
        }
      }
    },
    orderBy: {
      appointmentDate: 'asc'
    }
  });
}