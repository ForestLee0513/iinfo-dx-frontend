"use client";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";

import { LoadingCard } from "./parts/LoadingCard";
import { ProfileCard } from "./parts/ProfileCard";
import { SignInPrompt } from "./parts/SignInPrompt";
import { isUnauthorized } from "./utils";

// 상태를 소유하는 컨테이너: me 쿼리/로그아웃 뮤테이션을 들고
// 상태별 렌더링은 전부 parts/에 위임한다.
export function UserInfoCard() {
  const myInfo = useMyInfoQuery();
  const logout = useLogoutMutation();

  if (myInfo.isPending) {
    return <LoadingCard />;
  }

  // isError 또는 data === null(부트스트랩이 미로그인으로 확정) → 안내 카드
  if (myInfo.isError || myInfo.data === null) {
    return <SignInPrompt unauthorized={isUnauthorized(myInfo)} />;
  }

  return (
    <ProfileCard
      user={myInfo.data}
      isLoggingOut={logout.isPending}
      onLogout={() => logout.mutate()}
    />
  );
}
