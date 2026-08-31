"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { useMyInfoQuery } from "@/api/auth/queries";
import { useProfileQuery } from "@/api/profile/queries";
import { AccountPanel } from "./parts/AccountPanel";
import { PlaceholderPanel } from "./parts/PlaceholderPanel";
import { SettingsMobileNav } from "./parts/SettingsMobileNav";
import { SettingsSidebar } from "./parts/SettingsSidebar";
import { SETTINGS_TABS } from "./constants";
import type { SettingsTabId } from "./types";

// Figma 설정 화면(1440/768/320 너비 목업, 모바일은 아코디언)을 하나의 반응형 레이아웃으로
// 구현한다. md 미만은 아코디언 네비게이션, md 이상은 세로 사이드바로 전환된다.
//
// "계정" 탭만 대응하는 API(로그아웃/IIDX 탈퇴/회원 탈퇴)가 있어 실제로 동작하며,
// 나머지 탭은 디자인이 아직 없어 준비 중 패널을 보여준다.
export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("account");

  // 이 화면은 <AuthGuard>로 감싸져 있어 렌더될 때는 항상 로그인 상태다.
  const myInfo = useMyInfoQuery();
  const identifier = myInfo.data?.id;
  const profile = useProfileQuery(identifier);

  const activeLabel = SETTINGS_TABS.find((tab) => tab.id === activeTab)?.label ?? "";

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 pt-6 pb-10 md:gap-4 md:px-6 md:pt-10 md:pb-14 xl:px-12 xl:pt-12 xl:pb-16">
      <h1 className="text-2xl font-bold text-foreground md:text-[28px] xl:text-[32px]">설정</h1>
      <p className="text-xs text-muted-foreground md:text-[13px] xl:text-sm">
        닉네임, 프로필 정보 변경과 계정 관리를 할 수 있습니다.
      </p>

      <SettingsMobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex w-full flex-col gap-8 md:flex-row md:items-start xl:gap-16">
        <SettingsSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <div className="min-w-0 flex-1">
          {activeTab !== "account" ? (
            <PlaceholderPanel label={activeLabel} />
          ) : !identifier || profile.isPending ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <AccountPanel
              identifier={identifier}
              isIidxMember={profile.data?.joined_services.includes("iidx") ?? false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
