import prisma from '@/lib/prisma'
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from 'next/server'

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

    // Calcular data 30 dias antes de `startDate`
    const startDatePrev = new Date(startDate);
    startDatePrev.setDate(startDatePrev.getDate() - 30);
    const endDatePrev = new Date(startDate);

    const performanceCurrentAppointment = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        status: 'COMPLETED',
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: {
          select: {
            price: true
          }
        }
      }
    });

    const previousPerformanceAppointment = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        status: 'COMPLETED',
        appointmentDate: {
          gte: startDatePrev,
          lte: endDatePrev,
        },
      },
      include: {
        service: {
          select: {
            price: true
          }
        }
      }
    });

    const performanceTotalMonthCurrent = await prisma.appointment.count({
      where: {
        status: 'COMPLETED',
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const performanceTotalLastMonth = await prisma.appointment.count({
      where: {
        status: 'COMPLETED',
        userId: clinicId,
        appointmentDate: {
          gte: startDatePrev,
          lte: endDatePrev,
        },
      },
    });

    const totalPriceCurrent = performanceCurrentAppointment.reduce((soma, item) => soma + item.service.price.toNumber(), 0);
    const previousTotal = previousPerformanceAppointment.reduce((soma, item) => soma + item.service.price.toNumber(), 0);

    function calculatePercentChange(current: number, previous: number): number {
      if (previous === 0 && current) return 100;
      if (previous === 0 && current === 0) return 0;
      return ((current - previous) / previous) * 100;
    }

    const revenueChangePercent = calculatePercentChange(totalPriceCurrent, previousTotal);
    const appointmentChangePercent = calculatePercentChange(performanceTotalMonthCurrent, performanceTotalLastMonth);

    return NextResponse.json({
      // data: {
      currentPeriod: {
        appointmentsCurrent: performanceCurrentAppointment,
        appointmentsPrevious: previousPerformanceAppointment,
        totalRevenue: totalPriceCurrent,
        totalCurrentAppointmentsMonth: performanceTotalMonthCurrent,
      },
      previousPeriod: {
        totalRevenue: previousTotal,
      },
      comparison: {
        revenueChangePercent: revenueChangePercent,
        PercentageVariationInAppointments: appointmentChangePercent
      },
      // },
    });

  } catch (error) {
    console.error("Erro ao buscar metrics:", error);
    return NextResponse.json({ error: "Falha ao buscar metrics!" }, { status: 400 });
  }
});