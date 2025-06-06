export function colorStatus(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "text-blue-500";
    case "COMPLETED":
      return "text-green-500";
    case "NO_SHOW":
      return "text-orange-500";
    case "CANCELLED":
      return "text-red-500";
    default:
      return "text-yellow-400"; // PENDING ou qualquer outro
  }
}

export const statusMap = {
  PENDING: "Pendente",
  SCHEDULED: "Confirmado",
  COMPLETED: "Completo",
  NO_SHOW: "Não comparecido",
  CANCELLED: "Cancelado"
};