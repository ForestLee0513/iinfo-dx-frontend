import { Login } from "@/components/screens/Login";
import { sanitizeReturnUrl } from "@/lib/auth-redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string | string[];
    redirect?: string | string[];
  }>;
}) {
  // OAuth 실패 시 백엔드가 ?error=<한글 메시지>를 붙여 홈으로 돌려보내고,
  // app/page.tsx가 이 페이지로 전달한다
  const { error, redirect } = await searchParams;

  // redirect 쿼리는 브라우저(클라이언트 컴포넌트)로 넘어가기 전에 서버에서 먼저
  // 검증한다 — 화이트리스트(같은 출처 상대경로)를 통과하지 못하면 여기서 걸러지고,
  // 원본 값은 클라이언트 코드에 전달되지 않는다.
  const safeRedirect = sanitizeReturnUrl(redirect);

  return <Login error={error} redirect={safeRedirect} />;
}
