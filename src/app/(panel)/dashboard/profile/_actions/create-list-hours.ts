"use server"
import prisma from "@/lib/prisma";

/**
 * Função para configuração inicial dos horários.
 * Esta função deve ser executada apenas uma vez para criar a configuração inicial.
 * @param initalHour Hora inicial para começar a adicionar horários (formato 24h)
 */
export async function setupInitialSchedule(initalHour: number) {
  try {
    // Verifica se já existe algum schedule
    const existingSchedule = await prisma.schedules.findFirst();

    // Se já existe um schedule, não faz nada e retorna o existente
    if (existingSchedule) {
      console.log("Configuração já existe. Nenhuma alteração foi feita.");
      return existingSchedule;
    }

    // Se não existe, cria um novo schedule
    console.log("Criando configuração inicial de horários...");
    const newSchedule = await prisma.schedules.create({
      data: {}
    });

    // Adiciona os horários ao novo schedule
    for (let i = initalHour; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minutes = (j * 30).toString().padStart(2, "0");
        const time = `${hour}:${minutes}`;

        await prisma.hours.create({
          data: {
            schedulesId: newSchedule.id,
            time: time
          }
        });
      }
    }

    console.log("Configuração inicial concluída com sucesso!");
    return newSchedule;

  } catch (error) {
    console.log("Erro ao criar configuração inicial:", error);
    return null;
  }
}