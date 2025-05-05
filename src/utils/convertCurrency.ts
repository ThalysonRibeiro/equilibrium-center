import Decimal from 'decimal.js';
export function convertRealToCents(amount: string) {
  const numericPrice = Decimal(amount.replace(/\./g, '').replace(',', '.'));
  return numericPrice;
}