"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { AuthGuardProps } from "./types";

/*
페이지 접근 권한 가드 - Route Access Guard

page.tsx에서 화면을 감싸기만 하면 되는 재사용 래퍼.
판정 로직은 useAuthGuard가 갖고, 여기서는 렌더 분기만 담당한다.

  // 로그인 필요 (미로그인 → /login?redirect=<원래 경로>)
  <AuthGuard><SyncGuide /></AuthGuard>

  // 비로그인 전용 (로그인 상태 → /)
  <AuthGuard require="guest"><LoginForm /></AuthGuard>

  // 이동 경로/대기 UI 교체
  <AuthGuard redirectTo="/" fallback={<Skeleton className="h-40" />}>...</AuthGuard>

차단된 경우에도 리다이렉트가 실제로 일어나기 전 한 프레임이 존재하므로,
보호 대상 children은 그 사이에 절대 렌더하지 않는다.
*/
export function AuthGuard({ children, fallback, ...options }: AuthGuardProps) {
  const { status } = useAuthGuard(options);

  if (status !== "allowed") {
    return (
      fallback ?? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {status === "checking" ? "로그인 상태 확인 중..." : "로그인 페이지로 이동 중..."}
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
