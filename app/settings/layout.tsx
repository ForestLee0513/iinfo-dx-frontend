import type { ReactNode } from "react";

import { AuthGuard } from "@/components/common/AuthGuard";
import { SettingsShell } from "@/components/screens/Settings";

// 계정 관리(로그아웃/탈퇴)를 다루는 화면이라 로그인 사용자만 접근할 수 있다 — 하위
// 라우트(닉네임/정보/계정) 전체에 공통 셸(제목/네비게이션)과 함께 적용된다.
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SettingsShell>{children}</SettingsShell>
    </AuthGuard>
  );
}
