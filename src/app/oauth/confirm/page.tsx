// app/oauth/confirm/page.tsx
import { Suspense } from "react";
import ConfirmOAuthPage from "@/components/auth/ConfirmOAuthPage";

export const dynamic = "force-dynamic";

export default function OAuthConfirmWrapper() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ConfirmOAuthPage />
    </Suspense>
  );
}
