
export async function fetchData<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";

  const url = `${process.env.NEXT_PUBLIC_URL}/api/${endpoint}${query}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Erro ao buscar dados");
  }

  return data as T;
};
