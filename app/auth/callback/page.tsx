import { AuthCallback } from "@/components/screens/AuthCallback";
import { sanitizeReturnUrl } from "@/lib/auth-redirect";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string | string[] }>;
}) {
  const { error, redirect } = await searchParams;

  // redirect 쿼리는 브라우저(클라이언트 컴포넌트)로 넘어가기 전에 서버에서 먼저
  // 검증한다 — 화이트리스트(같은 출처 상대경로)를 통과하지 못하면 여기서 걸러지고,
  // 원본 값은 클라이언트 코드에 전달되지 않는다.
  const safeRedirect = sanitizeReturnUrl(redirect);

  return <AuthCallback error={error} redirect={safeRedirect} />;
}
