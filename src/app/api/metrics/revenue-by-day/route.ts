import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointments } from "@/lib/prisma/get-appointments";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }

  const clinicId = req.auth?.user?.id;
  if (!clinicId) {
    return NextResponse.json({ error: "Usuário não encontrado!" }, { status: 400 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 180);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const appointments = await getAppointments({
      userId: clinicId,
      startDate,
      endDate,
      status: 'COMPLETED',
    });

    const sumByDate: Record<string, number> = {};
    appointments.forEach(appt => {

      const dateString = appt.appointmentDate.toISOString().split('T')[0];

      const price = appt.service.price.toNumber();
      sumByDate[dateString] = (sumByDate[dateString] || 0) + price;
    });

    const dailyData = [];
    const baseToday = new Date(today);

    for (let i = 0; i < 90; i++) {
      const currentDay = new Date(baseToday);
      currentDay.setDate(currentDay.getDate() - i);

      const currentDayStr = currentDay.toISOString().split('T')[0];

      const previousDay = new Date(currentDay);
      previousDay.setDate(previousDay.getDate() - 90);
      const previousDayStr = previousDay.toISOString().split('T')[0];

      dailyData.push({
        date: currentDayStr,
        current: sumByDate[currentDayStr] || 0,
        previous: sumByDate[previousDayStr] || 0,
      });
    }

    const calculatePeriodTotals = (days: number) => {
      let currentPeriodTotal = 0;
      let previousPeriodTotal = 0;

      for (let i = 0; i < days; i++) {
        const currentDay = new Date(baseToday);
        currentDay.setDate(currentDay.getDate() - i);
        const currentDayStr = currentDay.toISOString().split('T')[0];
        currentPeriodTotal += sumByDate[currentDayStr] || 0;

        const previousDay = new Date(currentDay);
        previousDay.setDate(previousDay.getDate() - days);
        const previousDayStr = previousDay.toISOString().split('T')[0];
        previousPeriodTotal += sumByDate[previousDayStr] || 0;
      }

      return {
        currentPeriodTotal,
        previousPeriodTotal,
        percentageChange: previousPeriodTotal > 0
          ? ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100
          : 0
      };
    };

    const summary = {
      "7d": calculatePeriodTotals(7),
      "30d": calculatePeriodTotals(30),
      "90d": calculatePeriodTotals(90)
    };

    return NextResponse.json({
      dailyData: dailyData.reverse(),
      summary
    });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar métricas!" }, { status: 400 });
  }
})