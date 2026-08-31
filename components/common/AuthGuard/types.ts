import type { ReactNode } from "react";

import type { UseAuthGuardOptions } from "@/hooks/useAuthGuard";

export interface AuthGuardProps extends UseAuthGuardOptions {
  // 조건을 만족했을 때만 렌더되는 실제 화면.
  children: ReactNode;
  // 세션 판정 중(그리고 차단 후 이동 전)에 보여줄 대체 UI. 기본값은 안내 문구.
  fallback?: ReactNode;
}
