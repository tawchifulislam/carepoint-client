const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function publicApiFetch<T>(
  path: string,
  revalidateSeconds = 60,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
