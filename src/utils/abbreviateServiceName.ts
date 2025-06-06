export function abbreviateServiceName(value: string): string {
  const words = value.trim().split(/\s+/); // separa por espaços, ignora múltiplos
  if (words[0].toLowerCase() === "massagem") {
    const rest = words.slice(1).join(" ");
    return `M... ${rest}`;
  }
  return value;
}