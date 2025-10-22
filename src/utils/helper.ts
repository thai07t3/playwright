// Convert price to match cart format (e.g. "1000" -> "$1,000.00")
export function getFormattedPrice(price: string) {
  return `$${parseFloat(price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
