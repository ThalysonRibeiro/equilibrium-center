import prisma from '@/lib/prisma'
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from 'next/server'

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }

  const clinicId = req.auth?.user?.id;
  if (!clinicId) {
    return NextResponse.json({ error: "Usuário não encontrado!" }, { status: 400 });
  }

  try {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 90);

    const startDate = new Date(start.setUTCHours(0, 0, 0, 0));
    const endDate = new Date(end.setUTCHours(23, 59, 59, 999));

    const appointments = await prisma.appointment.findMany({
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
          select: { price: true }
        }
      }
    });

    // Cria um mapa com soma dos valores por dia
    const sumByDate: Record<string, number> = {};

    appointments.forEach(appt => {
      const date = appt.appointmentDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const price = appt.service.price.toNumber();
      sumByDate[date] = (sumByDate[date] || 0) + price;
    });

    const result = [];

    for (let i = 0; i < 45; i++) {
      const current = new Date();
      current.setDate(current.getDate() - i);
      const currentStr = current.toLocaleDateString('en-CA');

      const previous = new Date(current);
      previous.setDate(previous.getDate() - 45);
      const previousStr = previous.toLocaleDateString('en-CA');

      result.push({
        date: currentStr,
        current: sumByDate[currentStr] || 0,
        previous: sumByDate[previousStr] || 0,
      });
    }

    return NextResponse.json(result.reverse()); // opcional: do mais antigo pro mais recente
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json({ error: "Falha ao buscar métricas!" }, { status: 400 });
  }
})
