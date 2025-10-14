import ResetPassword from "@/components/auth/ResetPassword";

export default async function ResetPassPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const searchParamsPro = await searchParams;
  const token = searchParamsPro.token;

  if (!token) {
    return (
      <p className="text-red-600 text-center mt-10">Thiếu token kích hoạt.</p>
    );
  }

  return <ResetPassword token={token} />;
}
