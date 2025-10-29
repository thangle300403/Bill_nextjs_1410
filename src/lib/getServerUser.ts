// lib/getServerUser.ts
import { cookies } from "next/headers";

export async function getServerUser() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/me`, {
    headers: { Cookie: cookieHeader },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
