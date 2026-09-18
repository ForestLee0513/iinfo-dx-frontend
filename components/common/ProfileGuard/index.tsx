"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useMyInfoQuery } from "@/api/auth/queries";
import { useProfileQuery } from "@/api/profile/queries";

import type { ProfileGuardProps } from "./types";

// 로그인 후 프로필 생성이 필요한 기능을 감싼다. <AuthGuard> 안에서만 사용한다.
export function ProfileGuard({ children, fallback }: ProfileGuardProps) {
  const router = useRouter();
  const myInfo = useMyInfoQuery();
  const profile = useProfileQuery(myInfo.data?.id);
  const didRedirect = useRef(false);
  const needsOnboarding = profile.isSuccess && !profile.data?.handle;

  useEffect(() => {
    if (!needsOnboarding || didRedirect.current) return;
    didRedirect.current = true;
    router.replace("/onboarding");
  }, [needsOnboarding, router]);

  if (profile.isPending || needsOnboarding) {
    return (
      fallback ?? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">프로필 확인 중...</p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
