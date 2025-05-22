import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointments } from "@/lib/prisma/get-appointments";
import prisma from "@/lib/prisma";
import { groupAppointmentsByDate } from "@/utils/group-appointments-by-date";
import { getStartAndEndOfWeek } from "@/utils/get-start-and-endOfWeek";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }
  const clinicId = req.auth?.user?.id;

  if (!clinicId) {
    return NextResponse.json({ error: "Usuário não encontrado!" }, { status: 400 });
  }

  try {
    const allCompletedAppointments = await getAppointments({ userId: clinicId, status: 'COMPLETED' });

    const { start, end } = getStartAndEndOfWeek(new Date(), true);

    // Filtra só agendamentos da semana atual
    const appointmentsThisWeek = allCompletedAppointments.filter(({ appointmentDate }) => {
      if (!appointmentDate) return false;
      const date = new Date(appointmentDate);
      return date >= start && date <= end;
    });

    // Agrupa e garante todos os dias da semana
    const grouped = groupAppointmentsByDate(appointmentsThisWeek, start);
    const daysOfWeekWithCounts = Array.from(grouped.values());

    const appointmentsOfWeek = daysOfWeekWithCounts.reduce((acc, cur) => acc + cur.count, 0);

    // Conta agendamentos por hora
    const mapTimes = new Map<string, { time: string; count: number }>();
    allCompletedAppointments.forEach(({ time }) => {
      if (!time) return;
      const existing = mapTimes.get(time);
      if (existing) {
        existing.count++;
      } else {
        mapTimes.set(time, { time, count: 1 });
      }
    });

    const hours = Array.from(mapTimes.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      appointmentsOfWeek,
      daysOfWeekWithCounts,
      hours,
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json({ error: "Falha ao buscar métricas!" }, { status: 500 });
  }
});
