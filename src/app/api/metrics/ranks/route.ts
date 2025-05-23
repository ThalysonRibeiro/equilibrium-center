import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointments } from "@/lib/prisma/get-appointments";
import prisma from "@/lib/prisma";
import { groupAppointmentsByDate } from "@/utils/group-appointments-by-date";
import { getStartAndEndOfWeek } from "@/utils/get-start-and-endOfWeek";
import { createCustomerRanking } from "@/utils/rank-clients";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }
  const clinicId = req.auth?.user?.id;

  if (!clinicId) {
    return NextResponse.json({ error: "Usuário não encontrado!" }, { status: 400 });
  }

  try {
    const allAppointments = await getAppointments({ userId: clinicId, status: 'COMPLETED' });
    // Obter todos os clientes agrupados com seus agendamentos
    const groupedCustomers = createCustomerRanking(allAppointments);

    // Conta agendamentos por hora
    const mapTimes = new Map<string, { time: string; count: number }>();
    allAppointments.forEach(({ time }) => {
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
      groupedCustomers,
      hours,
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json({ error: "Falha ao buscar métricas!" }, { status: 500 });
  }
});
