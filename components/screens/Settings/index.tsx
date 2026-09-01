import type { ReactNode } from "react";

import { SettingsMobileNav } from "./parts/SettingsMobileNav";
import { SettingsSidebar } from "./parts/SettingsSidebar";

type SettingsShellProps = {
  children: ReactNode;
};

// Figma 설정 화면(1440/768/320 너비 목업, 모바일은 아코디언)을 하나의 반응형 레이아웃으로
// 구현한다. md 미만은 아코디언 네비게이션, md 이상은 세로 사이드바로 전환된다.
//
// 탭 전환은 로컬 state가 아니라 라우트(/settings/profile, /settings/account)로
// 관리한다 — app/settings/layout.tsx가 이 셸로 각 페이지를 감싼다.
export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 pt-6 pb-10 md:gap-4 md:px-6 md:pt-10 md:pb-14 xl:px-12 xl:pt-12 xl:pb-16">
      <h1 className="text-2xl font-bold text-foreground md:text-[28px] xl:text-[32px]">설정</h1>
      <p className="text-xs text-muted-foreground md:text-[13px] xl:text-sm">
        닉네임, 프로필 정보 변경과 계정 관리를 할 수 있습니다.
      </p>

      <SettingsMobileNav />

      <div className="flex w-full flex-col gap-8 md:flex-row md:items-start xl:gap-16">
        <SettingsSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
