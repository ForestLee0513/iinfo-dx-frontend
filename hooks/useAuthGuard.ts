"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useMyInfoQuery } from "@/api/auth/queries";
import type { AuthMyInfoResponse } from "@/api/auth/types";
import {
  buildLoginHref,
  getCurrentReturnUrl,
} from "@/lib/auth-redirect";
import { useAuthReady } from "@/providers/AuthReadyContext";

/*
페이지 단위 권한 가드 훅 - Route Access Guard

세션은 메모리 토큰 + httpOnly 쿠키 기반이라 서버에서 로그인 여부를 알 수 없다.
그래서 판정은 클라이언트에서 한다 —
AuthProvider 부트스트랩(ready)이 끝나 me 캐시가 확정된 뒤에만 통과/차단을 정한다.
(ready 전에 판정하면 로그인 상태인데도 미로그인으로 오인해 튕겨낸다.)

렌더 분기까지 한 번에 처리하려면 이 훅을 감싼 <AuthGuard>를 쓰고,
페이지 안에서 상태만 필요할 때 이 훅을 직접 쓴다.
*/

// "authenticated": 로그인 필요 / "guest": 비로그인 전용(로그인/회원가입 등)
export type AuthRequirement = "authenticated" | "guest";

// "checking": 세션 판정 중 / "allowed": 통과 / "denied": 차단(리다이렉트 진행)
export type AuthGuardStatus = "checking" | "allowed" | "denied";

export interface UseAuthGuardOptions {
  // 요구 조건 (기본 "authenticated")
  require?: AuthRequirement;
  // 차단 시 이동 경로 (기본: authenticated → /login, guest → /)
  redirectTo?: string;
  // 로그인 후 원래 경로로 되돌리기 위한 ?redirect= 부착 여부 (기본 true).
  // require: "authenticated" + redirectTo 미지정일 때만 의미가 있다.
  keepReturnUrl?: boolean;
}

export interface UseAuthGuardResult {
  status: AuthGuardStatus;
  // 판정이 끝나기 전에는 undefined, 끝나면 로그인 사용자 또는 null.
  myInfo: AuthMyInfoResponse | null | undefined;
}

export function useAuthGuard({
  require: requirement = "authenticated",
  redirectTo,
  keepReturnUrl = true,
}: UseAuthGuardOptions = {}): UseAuthGuardResult {
  const router = useRouter();
  const ready = useAuthReady();
  const myInfo = useMyInfoQuery();
  // 리다이렉트가 반영되기 전 재렌더로 replace가 중복 호출되는 것을 막는다.
  const didRedirect = useRef(false);

  // ready 전에는 me 쿼리가 비활성(isPending 유지)이라 아직 판정할 수 없다.
  const checking = !ready || myInfo.isPending;
  // me 조회 실패(쿠키 만료/네트워크)도 미로그인으로 본다 — 보호 페이지는 열지 않는다.
  const isLoggedIn = Boolean(myInfo.data);
  const allowed = requirement === "authenticated" ? isLoggedIn : !isLoggedIn;

  const status: AuthGuardStatus = checking
    ? "checking"
    : allowed
      ? "allowed"
      : "denied";

  useEffect(() => {
    if (status !== "denied" || didRedirect.current) return;
    didRedirect.current = true;

    if (redirectTo) {
      router.replace(redirectTo);
      return;
    }

    if (requirement === "guest") {
      router.replace("/");
      return;
    }

    router.replace(
      buildLoginHref(keepReturnUrl ? getCurrentReturnUrl() : undefined),
    );
  }, [status, requirement, redirectTo, keepReturnUrl, router]);

  return {
    status,
    myInfo: checking ? undefined : (myInfo.data ?? null),
  };
}
