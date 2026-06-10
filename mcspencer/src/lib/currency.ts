export function formatZAR(amount: number): string {
  return `R\u202F${amount.toLocaleString("en-ZA")}`;
}
