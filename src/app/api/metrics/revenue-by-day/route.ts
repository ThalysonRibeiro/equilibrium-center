import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointmentsByDay } from '@/app/(panel)/dashboard/reports/_data-access/get-revenue-by-day';
import { getAllAppointments } from "@/app/(panel)/dashboard/reports/_data-access/get-all-appointments";

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

    // Buscamos dados de 180 dias para comportar todas as comparações possíveis
    // (90 dias atuais + 90 dias anteriores para comparação)
    const endDate = new Date(today.setUTCHours(23, 59, 59, 999));
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 180);
    startDate.setUTCHours(0, 0, 0, 0);

    // Buscando todos os appointments no intervalo completo de 180 dias
    const appointments = await getAllAppointments(clinicId, startDate, endDate);

    // Cria um mapa com soma dos valores por dia
    const sumByDate: Record<string, number> = {};
    appointments.forEach(appt => {
      const date = appt.appointmentDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const price = appt.service.price.toNumber();
      sumByDate[date] = (sumByDate[date] || 0) + price;
    });

    // Preparando dados diários para os últimos 90 dias
    const dailyData = [];
    for (let i = 0; i < 90; i++) {
      const currentDay = new Date();
      currentDay.setDate(currentDay.getDate() - i);
      const currentDayStr = currentDay.toLocaleDateString('en-CA');

      // Dia correspondente no período anterior (mesmos 90 dias do ano anterior)
      const previousDay = new Date(currentDay);
      previousDay.setDate(previousDay.getDate() - 90);
      const previousDayStr = previousDay.toLocaleDateString('en-CA');

      dailyData.push({
        date: currentDayStr,
        current: sumByDate[currentDayStr] || 0,
        previous: sumByDate[previousDayStr] || 0,
      });
    }

    // Calcula totais para diferentes períodos
    const calculatePeriodTotals = (days: number) => {
      let currentPeriodTotal = 0;
      let previousPeriodTotal = 0;

      for (let i = 0; i < days; i++) {
        const currentDay = new Date();
        currentDay.setDate(currentDay.getDate() - i);
        const currentDayStr = currentDay.toLocaleDateString('en-CA');
        currentPeriodTotal += sumByDate[currentDayStr] || 0;

        const previousDay = new Date(currentDay);
        previousDay.setDate(previousDay.getDate() - days);
        const previousDayStr = previousDay.toLocaleDateString('en-CA');
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

    // Calcula os totais para os diferentes períodos de tempo
    const summary = {
      "7d": calculatePeriodTotals(7),
      "30d": calculatePeriodTotals(30),
      "90d": calculatePeriodTotals(90)
    };

    return NextResponse.json({
      dailyData: dailyData.reverse(), // Ordenar do mais antigo para o mais recente
      summary
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json({ error: "Falha ao buscar métricas!" }, { status: 400 });
  }
})