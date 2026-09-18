"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { AUTH_OAUTH_PROVIDERS } from "@/api/auth/constants";
import { startOAuthLogin } from "@/api/auth/requests";
import type { AuthOAuthProvider } from "@/api/auth/types";
import { RETURN_URL_PARAM, saveReturnUrl } from "@/lib/auth-redirect";

import { GoogleLogo } from "./parts/GoogleLogo";
import type { LoginProps } from "./types";

// 공급자가 늘어나면 여기에만 추가하면 된다 — AUTH_OAUTH_PROVIDERS와 satisfies로 누락을 막는다
const OAUTH_PROVIDER_META = {
  google: { label: "Sign in with Google", Icon: GoogleLogo },
} as const satisfies Record<
  AuthOAuthProvider,
  { label: string; Icon: ComponentType<{ className?: string }> }
>;

export function Login({ error, redirect }: LoginProps) {
  // 권한 가드(AuthGuard)가 붙여 보낸 복귀 경로 — 로그인 후 원래 가려던 페이지로 되돌린다.
  // 서버 컴포넌트(app/(auth)/login/page.tsx)가 이미 화이트리스트 검증을 마친 값이다.
  const returnUrl = redirect;
  // 최초 값만 상태로 잡아 그대로 표시한다(아래 effect가 URL의 error를 지워도 재표시되지 않도록)
  const rawOAuthError = Array.isArray(error) ? error[0] : error;
  const [oauthErrorMessage] = useState(() =>
    rawOAuthError !== undefined
      ? rawOAuthError.trim() || "소셜 로그인에 실패했습니다. 다시 시도해 주세요."
      : undefined,
  );

  // 새로고침 시 재표시되지 않도록 URL에서 error 파라미터만 제거 (재렌더링 없이)
  useEffect(() => {
    if (!oauthErrorMessage) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    window.history.replaceState(null, "", url);
  }, [oauthErrorMessage]);

  function handleOAuthLogin(provider: AuthOAuthProvider) {
    // 공급자로 전체 페이지 이동하면 상태가 사라지므로 복귀 경로를 sessionStorage에 맡긴다.
    // 복귀 경로가 없으면 이전 값이 지워져 다음 로그인이 엉뚱한 곳으로 가지 않는다.
    saveReturnUrl(returnUrl);

    // 백엔드가 콜백 URL의 쿼리를 그대로 돌려주는 경우를 위한 이중 경로 —
    // 보존되지 않아도 위 sessionStorage 값으로 복구된다.
    const callbackQuery = returnUrl
      ? `?${RETURN_URL_PARAM}=${encodeURIComponent(returnUrl)}`
      : "";

    startOAuthLogin({
      provider,
      redirect: `${window.location.origin}/auth/callback${callbackQuery}`,
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">로그인</CardTitle>
        <CardDescription>선호하는 플랫폼을 선택하여 로그인하세요.</CardDescription>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          {oauthErrorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{oauthErrorMessage}</AlertDescription>
            </Alert>
          )}

          {AUTH_OAUTH_PROVIDERS.map((provider) => {
            const { label, Icon } = OAUTH_PROVIDER_META[provider];
            return (
              <Button
                key={provider}
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin(provider)}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            );
          })}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
