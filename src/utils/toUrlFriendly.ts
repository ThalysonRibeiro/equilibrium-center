export function toUrlFriendly(text: string) {
  return text
    .toLowerCase()               // deixa minúsculo
    .trim()                     // remove espaços no início e fim
    .replace(/[áàâãä]/gi, 'a')
    .replace(/[éèêë]/gi, 'e')
    .replace(/[íìîï]/gi, 'i')
    .replace(/[óòôõö]/gi, 'o')
    .replace(/[úùûü]/gi, 'u')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, "-")       // troca um ou mais espaços por hífen
    .replace(/[^\w-]+/g, "")    // remove caracteres que não sejam letras, números ou hífen
    .replace(/--+/g, "-");      // evita hífens duplicados
}

export function fromUrlFriendly(slug: string) {
  return slug
    .toLowerCase()
    .replace(/-/g, " "); // troca hífens por espaços
}
