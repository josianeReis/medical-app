import { redirect } from "next/navigation";

export function redirectWithParams(base: string, params: Record<string, any>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') search.set(key, value);
  }

  const query = search.toString();
  redirect(`${base}${query ? `?${query}` : ''}`);
}