import { Appointment } from "@/generated/prisma";

/**
 * Agrupa todos os appointments por cliente (email + phone)
 * Esta implementação é otimizada para performance
 * @param {Array} allAppointments - Array de todos os appointments
 * @returns {Array} Array de objetos de cliente com seus appointments agrupados
 */
export function groupAppointmentsByClient(allAppointments: Appointment[]) {
  // Usar Map para performance ótima em grandes conjuntos de dados
  const clientesMap = new Map();

  // Primeira passagem: agrupar appointments por cliente
  allAppointments.forEach(appointment => {
    // Pular registros sem email ou phone
    if (!appointment.email || !appointment.phone) return;

    // Normalizar dados para comparação consistente
    const email = appointment.email.trim().toLowerCase();
    const phone = appointment.phone.trim();
    const chave = `${email}-${phone}`;

    if (!clientesMap.has(chave)) {
      // Primeiro appointment deste cliente
      clientesMap.set(chave, {
        // Dados básicos do cliente
        name: appointment.name || appointment.name || "Cliente sem name",
        email: email,
        phone: phone,
        // Array com todos os appointments deste cliente
        appointments: [appointment],
        // Contador para ranking
        count: 1
      });
    } else {
      // Cliente já existe, adicionar este appointment ao array
      const cliente = clientesMap.get(chave);
      cliente.appointments.push(appointment);
      cliente.count += 1;

      // Atualizar name se o atual for "Cliente sem name" e tiver um name melhor disponível
      if ((cliente.name.trim === "Cliente sem name") && (appointment.name || appointment.name)) {
        cliente.name = appointment.name || appointment.name;
      }
    }
  });

  // Converter Map para array e ordenar por count de appointments (ranking)
  const clientesAgrupados = Array.from(clientesMap.values());
  clientesAgrupados.sort((a, b) => b.count - a.count);

  return clientesAgrupados;
}

/**
 * Função mais simples que apenas retorna um ranking sem armazenar os appointments
 * Útil quando você só precisa do ranking sem os dados completos
 */
export function createCustomerRanking(allAppointments: Appointment[]) {
  const clientesAgrupados = groupAppointmentsByClient(allAppointments);

  // Extrair apenas os dados básicos e a contagem para o ranking
  return clientesAgrupados.map(cliente => ({
    name: cliente.name.trim(),
    email: cliente.email,
    phone: cliente.phone,
    count: cliente.count
  }));
}