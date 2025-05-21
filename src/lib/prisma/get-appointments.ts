import prisma from "@/lib/prisma";

type GetAppointmentsOptions = {
  userId: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  serviceFields?: {
    id?: boolean;
    name?: boolean;
    price?: boolean;
    duration?: boolean;
  };
  order?: 'asc' | 'desc';
};

export async function getAppointments({
  userId,
  status,
  startDate,
  endDate,
  serviceFields = { id: true, name: true, price: true, duration: true },
  order = 'desc'
}: GetAppointmentsOptions) {
  const where: any = { userId };
  if (status) where.status = status;
  if (startDate || endDate) {
    where.appointmentDate = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };
  }

  return prisma.appointment.findMany({
    where,
    include: {
      service: {
        select: serviceFields,
      },
    },
    orderBy: {
      appointmentDate: order,
    },
  });
}
