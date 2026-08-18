"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  Input,
} from "@forestlee0513/iinfo-dx-design-system";

import { useQueryClient } from "@tanstack/react-query";

import { AUTH_OAUTH_PROVIDERS } from "@/api/auth/constants";
import { startOAuthLogin } from "@/api/auth/requests";
import { useEmailLoginMutation } from "@/api/auth/queries";
import type { AuthOAuthProvider } from "@/api/auth/types";
import { profileQueryOptions } from "@/api/profile/queries";
import {
  RETURN_URL_PARAM,
  clearReturnUrl,
  sanitizeReturnUrl,
  saveReturnUrl,
} from "@/lib/auth-redirect";

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ detail?: string }>(error)) {
    if (error.response?.status === 401) {
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    }
    return error.response?.data?.detail ?? "로그인에 실패했습니다.";
  }
  return "로그인에 실패했습니다.";
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; redirect?: string | string[] }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const emailLogin = useEmailLoginMutation();

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    emailLogin.mutate(
      {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      },
      {
        onSuccess: async (data) => {
          sessionStorage.setItem("handle_setup_redirected", "1");
          // OAuth 시도가 남겨둔 값이 다음 로그인에 끼어들지 않게 정리한다
          clearReturnUrl();
          if (returnUrl) {
            router.replace(returnUrl);
            return;
          }
          try {
            // 프로필을 캐시에 적재하면서 handle 여부도 확인 — 한 번의 요청으로 처리
            const profile = await queryClient.fetchQuery(
              profileQueryOptions(data.user.id),
            );
            router.replace(`/profile/${profile.handle ?? data.user.id}`);
          } catch {
            router.replace(`/profile/${data.user.id}`);
          }
        },
      },
    );
  }

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
        <CardDescription>이메일과 비밀번호를 입력해 로그인하세요.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {oauthErrorMessage && emailLogin.isIdle && (
              <Alert variant="destructive">
                <AlertDescription>{oauthErrorMessage}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
              />
            </Field>

            {emailLogin.isError && (
              <FieldError errors={[{ message: getErrorMessage(emailLogin.error) }]} />
            )}

            <Field>
              <Button type="submit" disabled={emailLogin.isPending}>
                {emailLogin.isPending ? "로그인 중..." : "이메일로 로그인"}
              </Button>
            </Field>

            <FieldSeparator>또는</FieldSeparator>

            {AUTH_OAUTH_PROVIDERS.map((provider) => (
              <Field key={provider}>
                <Button
                  type="button"
                  variant="outline"
                  className="capitalize"
                  onClick={() => handleOAuthLogin(provider)}
                >
                  {provider}로 계속하기
                </Button>
              </Field>
            ))}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/sign-up" className="ml-1 text-foreground underline underline-offset-4">
          회원가입
        </Link>
      </CardFooter>
    </Card>
  );
}
