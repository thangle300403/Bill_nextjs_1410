import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface ActiveAccountPageProps {
  searchParams: { token?: string };
}

export default async function ActiveAccountPage({
  searchParams,
}: ActiveAccountPageProps) {
  const token = searchParams?.token;

  if (!token) {
    console.error("Thiếu token kích hoạt.");
    redirect("/?showLogin=true");
  }

  try {
    const cookieStore = cookies(); // ✅ don't need await
    const cookieList = cookieStore.getAll ? cookieStore.getAll() : [];
    const cookieHeader = cookieList
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API_URL}/active_account?token=${token}`,
      {
        method: "GET",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("[Kích hoạt lỗi]", await res.text());
    }
  } catch (err) {
    console.error("Activation failed:", err);
  }

  redirect("/?showLogin=true");
}
