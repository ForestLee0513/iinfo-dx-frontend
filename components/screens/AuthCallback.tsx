"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useMyInfoQuery } from "@/api/auth/queries";
import { useProfileQuery } from "@/api/profile/queries";
import {
  LOGIN_PATH,
  RETURN_URL_PARAM,
  clearReturnUrl,
  peekReturnUrl,
} from "@/lib/auth-redirect";
import { useAuthReady } from "@/providers/AuthReadyContext";

// 세션 복원 + 프로필 조회가 이 시간 내 완료되지 않으면 홈으로 이동
const TIMEOUT_MS = 10_000;

type AuthCallbackProps = {
  error?: string;
  // app/auth/callback/page.tsx(서버 컴포넌트)가 이미 화이트리스트 검증을 마친 값이다.
  redirect?: string;
};

export function AuthCallback({ error, redirect }: AuthCallbackProps) {
  const router = useRouter();
  const ready = useAuthReady();
  const { data: myInfo } = useMyInfoQuery();

  /*
  권한 가드에서 넘어온 복귀 경로.
  OAuth는 외부 공급자를 거쳐 돌아오므로 sessionStorage에 맡겨둔 값을 1순위로 보고,
  백엔드가 콜백 URL의 쿼리를 보존한 경우엔 (이미 서버에서 검증된) redirect prop을 폴백으로 쓴다.
  (읽기만 하므로 렌더 중 호출해도 안전 — 실제 삭제는 이동 직전에 한다)
  */
  const [returnUrl] = useState(() => peekReturnUrl() ?? redirect);

  // 신규 가입자는 복귀 경로보다 프로필 생성이 우선이다. 핸들 등록 여부를 확인한 뒤
  // 기존 회원만 원래 목적지로 돌려보낸다.
  const profile = useProfileQuery(ready && myInfo ? myInfo.id : undefined);
  const didRedirect = useRef(false);

  // ?error= 파라미터 — 백엔드는 에러 시 홈으로 보내지만 혹시 이 페이지로 들어온 경우 방어.
  // 복귀 경로는 로그인 페이지로 함께 넘겨, 재시도 후에도 원래 가려던 곳으로 돌아가게 한다.
  useEffect(() => {
    if (error && !didRedirect.current) {
      didRedirect.current = true;
      clearReturnUrl();
      const query = new URLSearchParams({ error });
      if (returnUrl) query.set(RETURN_URL_PARAM, returnUrl);
      router.replace(`${LOGIN_PATH}?${query.toString()}`);
    }
  }, [error, returnUrl, router]);

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
      clearReturnUrl();
      router.replace("/");
      return;
    }

    // 신규 계정(핸들 미등록)은 redirect 유무와 관계없이 바로 프로필 생성으로 안내한다.
    // 온보딩 화면에서는 별도 이탈 방지를 하지 않으므로, 홈 이동 등 사용자의 자발적인
    // 페이지 이동은 그대로 허용된다.
    if (profile.isSuccess && !profile.data?.handle) {
      didRedirect.current = true;
      clearReturnUrl();
      router.replace("/onboarding");
      return;
    }

    // 프로필 조회 실패 — 인증은 됐으므로 홈으로
    if (profile.isError) {
      didRedirect.current = true;
      clearReturnUrl();
      router.replace("/");
      return;
    }

    if (profile.isPending || !profile.data) return;

    // 기존 회원만 로그인 전의 목적지로 복귀시킨다.
    if (returnUrl) {
      didRedirect.current = true;
      clearReturnUrl();
      sessionStorage.setItem("handle_setup_redirected", "1");
      router.replace(returnUrl);
      return;
    }

    const slug = profile.data.handle ?? myInfo.id;
    didRedirect.current = true;
    sessionStorage.setItem("handle_setup_redirected", "1");
    router.replace(`/profile/${slug}`);
  }, [
    ready,
    myInfo,
    profile.isPending,
    profile.isSuccess,
    profile.isError,
    profile.data,
    returnUrl,
    router,
  ]);

  if (error) return null;

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-muted-foreground">로그인 처리 중...</p>
    </div>
  );
}
