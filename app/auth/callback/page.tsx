"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useMyInfoQuery } from "@/api/auth/queries";
import { useProfileQuery } from "@/api/profile/queries";
import { useAuthReady } from "@/providers/AuthReadyContext";

// 세션 복원 + 프로필 조회가 이 시간 내 완료되지 않으면 홈으로 이동
const TIMEOUT_MS = 10_000;

export default function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = use(searchParams);
  const router = useRouter();
  const ready = useAuthReady();
  const { data: myInfo } = useMyInfoQuery();
  const profile = useProfileQuery(ready && myInfo ? myInfo.id : undefined);
  const didRedirect = useRef(false);

  // ?error= 파라미터 — 백엔드는 에러 시 홈으로 보내지만 혹시 이 페이지로 들어온 경우 방어
  useEffect(() => {
    if (error && !didRedirect.current) {
      didRedirect.current = true;
      router.replace(`/login?error=${encodeURIComponent(error)}`);
    }
  }, [error, router]);

  // 타임아웃 — 세션 복원/프로필 조회가 TIMEOUT_MS 내 끝나지 않으면 홈으로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!didRedirect.current) {
        didRedirect.current = true;
        router.replace("/");
      }
    }, TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [router]);

  // 인증 완료 후 목적지 결정
  useEffect(() => {
    if (!ready || didRedirect.current) return;

    // 직접 접근 또는 인증 실패 — 홈으로
    if (!myInfo) {
      didRedirect.current = true;
      router.replace("/");
      return;
    }

    // 프로필 조회 실패 — 인증은 됐으므로 홈으로
    if (profile.isError) {
      didRedirect.current = true;
      router.replace("/");
      return;
    }

    if (profile.isPending || !profile.data) return;

    const slug = profile.data.handle ?? myInfo.id;
    didRedirect.current = true;
    sessionStorage.setItem("handle_setup_redirected", "1");
    router.replace(`/profile/${slug}`);
  }, [ready, myInfo, profile.isPending, profile.isError, profile.data, router]);

  if (error) return null;

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-muted-foreground">로그인 처리 중...</p>
    </div>
  );
}
