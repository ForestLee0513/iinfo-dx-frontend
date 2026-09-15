import type { ReactNode } from "react";

export interface ProfileGuardProps {
  // 프로필 생성이 끝난 사용자에게만 렌더되는 화면.
  children: ReactNode;
  // 프로필 확인 및 온보딩 이동 중 표시할 대체 UI.
  fallback?: ReactNode;
}
