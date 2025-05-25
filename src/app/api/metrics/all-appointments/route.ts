import prisma from '@/lib/prisma';
import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { AppointmentStatus } from '@/generated/prisma';
import { getAppointments } from '@/lib/prisma/get-appointments';


export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }
  const searchParams = req.nextUrl.searchParams;
  const startDateString = searchParams.get('start-date') as string;
  const endDateString = searchParams.get('end-date') as string;
  const clinicId = req.auth?.user?.id;

  if (!clinicId) {
    return NextResponse.json({ error: "Usuários não encontrado!" }, { status: 400 });
  }
  try {
    let startDate: Date;
    let endDate: Date;
    if (!startDateString || !endDateString) {
      const now = new Date();
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30, 0, 0, 0));
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    } else {
      const [startYear, startMonth, startDay] = startDateString.split("-").map(Number);
      const [endYear, endMonth, endDay] = endDateString.split("-").map(Number);

      startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999));
    }

    const allAppointments = await getAppointments({ userId: clinicId, startDate, endDate });

    const countAllAppointments = allAppointments.length;


    const statuses: AppointmentStatus[] = ['PENDING', 'SCHEDULED', 'COMPLETED', 'NO_SHOW', 'CANCELLED'] as const;
    type Status = typeof statuses[number];

    type CountByStatus = {
      [K in Status as `count${Capitalize<Lowercase<K>>}`]: number;
    };

    type PercentageByStatus = {
      [K in keyof CountByStatus]: string;
    };

    const countByStatus = {} as CountByStatus;

    const countsArray = await Promise.all(
      statuses.map(status =>
        prisma.appointment.count({
          where: {
            userId: clinicId,
            status,
            appointmentDate: {
              gte: startDate,
              lte: endDate
            }
          }
        })
      )
    );

    statuses.forEach((status, i) => {
      const key = `count${status.charAt(0)}${status.slice(1).toLowerCase()}` as keyof CountByStatus;
      countByStatus[key] = countsArray[i];
    });

    const percentageByStatus = {} as PercentageByStatus;

    for (const key in countByStatus) {
      const value = countByStatus[key as keyof CountByStatus];
      percentageByStatus[key as keyof PercentageByStatus] =
        countAllAppointments > 0
          ? ((value / countAllAppointments) * 100).toFixed(2) + '%'
          : '0.00%';
    }

    return NextResponse.json({
      startDate,
      endDate,
      allAppointments,
      countAllAppointments,
      metricStatus: {
        countByStatus,
        percentageByStatus
      },
    });

  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar métricas!" }, { status: 400 });
  }
});