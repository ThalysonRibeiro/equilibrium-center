import prisma from '@/lib/prisma'
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from 'next/server'
import { getSchedulingSpecificDate } from '@/app/(panel)/dashboard/reports/_data-access/get-overview';
import { getAllAppointments } from '@/app/(panel)/dashboard/reports/_data-access/get-all-appointments';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const startDateString = searchParams.get('start-date') as string;
  const endDateString = searchParams.get('end-date') as string;
  const clinicId = req.auth?.user?.id;

  if (!startDateString || !endDateString) {
    return NextResponse.json({ error: "Data não encontrado!" }, { status: 400 });
  }
  if (!clinicId) {
    return NextResponse.json({ error: "Usuários não encontrado!" }, { status: 400 });
  }

  try {
    const [startYear, startMonth, startDay] = startDateString.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDateString.split("-").map(Number);

    const startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999));


    const schedulingSpecificDate = await getAllAppointments(clinicId, startDate, endDate);

    const performanceTotalSpecificDate = schedulingSpecificDate.length;
    const totalPriceSpecificDate = schedulingSpecificDate.reduce((soma, item) => soma + item.service.price.toNumber(), 0);

    return NextResponse.json({
      schedulingSpecificDate,
      performanceTotalSpecificDate,
      totalPriceSpecificDate
    });

  } catch (error) {
    console.error("Erro ao buscar metrics:", error);
    return NextResponse.json({ error: "Falha ao buscar metrics!" }, { status: 400 });
  }
});