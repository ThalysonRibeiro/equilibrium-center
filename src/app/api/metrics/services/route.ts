import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointments } from "@/lib/prisma/get-appointments";

type ServiceWithCounting = {
  id: string;
  name: string;
  price: string;
  count: number;
  totalAmount: number;
  totalDuration: number;
};

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }

  const clinicId = req.auth?.user?.id;
  if (!clinicId) {
    return NextResponse.json({ error: "Usuário não encontrado!" }, { status: 400 });
  }


  const appointments = await getAppointments({
    userId: clinicId,
    // startDate,
    // endDate,
    status: 'COMPLETED',
  });

  const map = new Map<string, ServiceWithCounting>();

  appointments.forEach(({ service }) => {
    const existing = map.get(service.id);
    if (existing) {
      existing.count++;
      existing.totalAmount += service.price.toNumber();
      existing.totalDuration += service.duration;
    } else {
      map.set(service.id, {
        id: service.id,
        name: service.name,
        price: service.price.toString(),
        count: 1,
        totalAmount: service.price.toNumber(),
        totalDuration: service.duration
      });
    }
  });

  const topService = Array.from(map.values()).sort((a, b) => b.count - a.count);



  return NextResponse.json(topService)
})