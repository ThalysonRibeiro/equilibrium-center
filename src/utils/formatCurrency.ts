const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
  // minimumFractionDigits: 0
});

export function formatCurrency(value: string) {
  const number = parseFloat(value);
  return CURRENCY_FORMATTER.format(number);
}