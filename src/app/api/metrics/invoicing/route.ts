import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointments } from "@/lib/prisma/get-appointments";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }
  const clinicId = req.auth?.user?.id;

  if (!clinicId) {
    return NextResponse.json({ error: "Usuários não encontrado!" }, { status: 400 });
  }

  try {
    // Definir os períodos de tempo
    // Data atual
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Fim do dia de hoje

    // Data de 30 dias atrás
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 dias atrás
    startDate.setHours(0, 0, 0, 0); // Início do dia de 30 dias atrás

    // Período anterior: 30 dias antes do período atual
    const endDatePrev = new Date(startDate);
    endDatePrev.setDate(endDatePrev.getDate() - 1); // Dia anterior ao início do período atual
    endDatePrev.setHours(23, 59, 59, 999); // Fim do dia anterior

    const startDatePrev = new Date(startDate);
    startDatePrev.setDate(startDatePrev.getDate() - 30); // 60 dias atrás
    startDatePrev.setHours(0, 0, 0, 0); // Início do dia 60 dias atrás

    // Uma única consulta que busca TODOS os agendamentos completados
    const allCompletedAppointments = await getAppointments({ userId: clinicId, status: 'COMPLETED', });
    const allCancelledAppointments = await getAppointments({ userId: clinicId, status: 'CANCELLED', });

    const possibleLosses = allCancelledAppointments.reduce((acc, cur) => acc + cur.service.price.toNumber(), 0);
    const totalAppointmentCancelled = allCancelledAppointments.length;

    // Métricas para todos os agendamentos
    const totalAppointments = allCompletedAppointments.length;
    const totalInvoicing = allCompletedAppointments.reduce(
      (acc, item) => acc + item.service.price.toNumber(),
      0
    );

    // Filtrar para os períodos específicos
    const lastSixtyDaysAppointments = allCompletedAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= startDatePrev && appointmentDate <= endDate;
    });

    // Separar os resultados dos últimos 60 dias em dois períodos
    const currentPeriodAppointments = lastSixtyDaysAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });

    const previousPeriodAppointments = lastSixtyDaysAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= startDatePrev && appointmentDate <= endDatePrev;
    });

    // Calcular métricas para o período atual
    const currentPeriodCount = currentPeriodAppointments.length;
    const currentPeriodRevenue = currentPeriodAppointments.reduce(
      (total, appointment) => total + appointment.service.price.toNumber(),
      0
    );

    // Calcular métricas para o período anterior
    const previousPeriodCount = previousPeriodAppointments.length;
    const previousPeriodRevenue = previousPeriodAppointments.reduce(
      (total, appointment) => total + appointment.service.price.toNumber(),
      0
    );

    // Calcular variações percentuais
    function calculatePercentChange(current: number, previous: number) {
      if (previous === 0 && current > 0) return 100;
      if (previous === 0 && current === 0) return 0;
      return ((current - previous) / previous) * 100;
    }

    const revenueChangePercent = calculatePercentChange(currentPeriodRevenue, previousPeriodRevenue);
    const appointmentChangePercent = calculatePercentChange(currentPeriodCount, previousPeriodCount);

    return NextResponse.json({
      metricsTotalInvoicing: {
        appointments: allCompletedAppointments,
        totalAppointments,
        totalInvoicing,
        possibleLosses,
        totalAppointmentCancelled
      },
      currentPeriod: {
        appointments: currentPeriodAppointments,
        totalAppointments: currentPeriodCount,
        totalRevenue: currentPeriodRevenue,
        startDate: endDate,
        endDate: startDate,
      },
      previousPeriod: {
        appointments: previousPeriodAppointments,
        totalAppointments: previousPeriodCount,
        totalRevenue: previousPeriodRevenue,
        startDate: startDatePrev,
        endDate: endDatePrev,
      },
      comparison: {
        revenueChangePercent,
        appointmentChangePercent
      }
    });

  } catch (error) {
    console.error("Erro ao buscar metricaws:", error);
    return NextResponse.json({ error: "Falha ao buscar metricas!" }, { status: 400 });
  }
});