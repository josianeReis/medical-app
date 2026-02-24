
import { env } from "@/utils/env";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import qs from "querystring";

const getCookieHeader = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const cookieList = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  // Avoid sending an empty "Cookie" header – some servers (and reverse proxies)
  // treat an empty value as malformed and close the socket without a response.
  // If we have no cookies just return an empty object so `fetch` won’t include
  // the header at all.
  return cookieList ? { Cookie: cookieList } : {};
};

const zodSchema = createSchema({
  // "/path": {
  //     input: z.object({
  //         userId: z.string(),
  //         id: z.number(),
  //         title: z.string(),
  //         completed: z.boolean(),
  //     }),
  //     output: z.object({
  //         userId: z.string(),
  //         id: z.number(),
  //         title: z.string(),
  //         completed: z.boolean(),
  //     }),
  // }
});

const apiClient = createFetch({
  baseURL: env.API_URL,
  retry: {
    count: 3,
    interval: 1000, //optional
    type: "exponential",
    attempts: 5,
    baseDelay: 1000, // Start with 1 second delay
    maxDelay: 10000, // Cap the delay at 10 seconds, so requests would go out after 1s then 2s, 4s, 8s, 10s
  },
  schema: zodSchema,
});

const handleSetCookies = async (setCookies: string[]) => {
  const cookieStore = await cookies();
  setCookies.map((cookie) => {
    const decodedCookie = qs.decode(cookie, "; ");
    const [name, value] = Object.entries(decodedCookie)[0];

    cookieStore.set({
      name,
      value: value as string,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(decodedCookie.MaxAge) || 604800, // 1 week in seconds from Max-Age
      path: decodedCookie.Path as string,
      sameSite: decodedCookie.SameSite as "lax" | "strict" | "none",
    });
  });
};

interface ApiError {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
}

const getErrorMessage = async (error: ApiError) => {
  const t = await getTranslations("api");
  if (error?.code && t.has(error?.code)) {
    return t(error?.code);
  }
  console.error({ ...error, hasTranslation: t.has(error?.code ?? "") });
  return error?.message || "An unknown error occurred";
};

export {
  apiClient,
  getCookieHeader,
  getErrorMessage,
  handleSetCookies,
  type ApiError,
};
