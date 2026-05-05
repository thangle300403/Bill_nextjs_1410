// lib/getServerUser.ts
import { cookies } from "next/headers";

export async function getServerUser() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
  if (!apiUrl) return null;

  let res: Response;
  try {
    res = await fetch(`${apiUrl}/me`, {
      headers: { Cookie: cookieHeader },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
