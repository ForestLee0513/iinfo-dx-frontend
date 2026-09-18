"use client";

import { useMyInfoQuery } from "@/api/auth/queries";
import { useProfileQuery } from "@/api/profile/queries";

// 세 하위 라우트(닉네임/정보/계정)가 공통으로 필요한 "내 프로필" 조회 —
// 이 화면은 <AuthGuard>로 감싸져 있어 호출될 때는 항상 로그인 상태다.
export function useSettingsProfile() {
  const myInfo = useMyInfoQuery();
  const identifier = myInfo.data?.id;
  const profile = useProfileQuery(identifier);

  return {
    identifier,
    profile: profile.data,
    isPending: !identifier || profile.isPending,
  };
}
