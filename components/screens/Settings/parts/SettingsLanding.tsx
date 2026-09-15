"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

import { useSettingsProfile } from "../hooks/useSettingsProfile";

// /settings의 기본 탭은 프로필 생성 여부에 따라 다르다. 미완료 회원에게는
// 숨겨진 정보 변경 탭 대신 계정 관리 화면을 보여준다.
export function SettingsLanding() {
  const router = useRouter();
  const { profile, isPending } = useSettingsProfile();

  useEffect(() => {
    if (isPending || !profile) return;
    router.replace(profile.handle ? "/settings/profile" : "/settings/account");
  }, [isPending, profile, router]);

  return <Skeleton className="h-48 w-full" />;
}
