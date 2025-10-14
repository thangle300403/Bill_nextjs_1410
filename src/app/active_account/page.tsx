import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ActiveAccountPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    console.error("Thiếu token kích hoạt.");
    return redirect("/?showLogin=true");
  }

  try {
    const cookieStore = cookies();
    const cookieVal = await cookieStore;
    const cookieHeader = cookieVal
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API_URL}/active_account?token=${token}`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
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
