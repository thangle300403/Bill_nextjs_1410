import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ActiveAccountPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const token =
    typeof searchParams?.token === "string" ? searchParams.token : undefined;

  if (!token) {
    console.error("Thiếu token kích hoạt.");
    redirect("/?showLogin=true");
  }

  try {
    // 👇 add await here
    const cookieStore = await cookies();
    const cookieList = cookieStore.getAll();
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
