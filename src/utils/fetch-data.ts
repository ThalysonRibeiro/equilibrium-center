// export async function fetchData<T>(
//   endpoint: string,
//   params?: Record<string, string | number>
// ): Promise<T> {
//   const query = params
//     ? "?" + new URLSearchParams(
//       Object.fromEntries(
//         Object.entries(params).map(([key, value]) => [key, String(value)])
//       )
//     ).toString()
//     : "";

//   const url = `${process.env.NEXT_PUBLIC_URL}/api/${endpoint}${query}`;
//   const response = await fetch(url);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error("Erro ao buscar dados");
//   }

//   return data as T;
// }
export async function fetchData<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  signal?: AbortSignal
): Promise<T> {
  const query = params
    ? "?" + new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    ).toString()
    : "";

  const url = `${process.env.NEXT_PUBLIC_URL}/api/${endpoint}${query}`;
  const response = await fetch(url, { signal });
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Erro ao buscar dados");
  }

  return data as T;
}
