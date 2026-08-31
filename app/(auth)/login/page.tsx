"use client";

import { use, useEffect, useState } from "react";
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
import {
  RETURN_URL_PARAM,
  sanitizeReturnUrl,
  saveReturnUrl,
} from "@/lib/auth-redirect";

// Google 공식 4색 로고 — "Sign in with Google" 버튼은 브랜드 가이드라인상 이 마크를 그대로 써야 한다
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3436 0-4.3282-1.5831-5.036-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 000 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.5564 3.5795 9 3.5795z"
      />
    </svg>
  );
}

// 공급자가 늘어나면 여기에만 추가하면 된다 — AUTH_OAUTH_PROVIDERS와 satisfies로 누락을 막는다
const OAUTH_PROVIDER_META = {
  google: { label: "Sign in with Google", Icon: GoogleLogo },
} as const satisfies Record<
  AuthOAuthProvider,
  { label: string; Icon: ComponentType<{ className?: string }> }
>;

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; redirect?: string | string[] }>;
}) {
  // OAuth 실패 시 백엔드가 ?error=<한글 메시지>를 붙여 홈으로 돌려보내고,
  // app/page.tsx가 이 페이지로 전달한다 — 최초 값만 상태로 잡아 그대로 표시한다
  const { error, redirect } = use(searchParams);
  // 권한 가드(AuthGuard)가 붙여 보낸 복귀 경로 — 로그인 후 원래 가려던 페이지로 되돌린다
  const returnUrl = sanitizeReturnUrl(redirect);
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
