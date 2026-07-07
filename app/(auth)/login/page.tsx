"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { use } from "react";

import { AUTH_OAUTH_PROVIDERS } from "@/api/auth/constants";
import { startOAuthLogin, useEmailLoginMutation } from "@/api/auth/requests";
import type { AuthOAuthProvider } from "@/api/auth/types";

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
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const router = useRouter();
  const emailLogin = useEmailLoginMutation();

  // OAuth 실패 시 백엔드가 ?error=<한글 메시지>를 붙여 홈으로 돌려보내고,
  // app/page.tsx가 이 페이지로 전달한다 — 메시지를 그대로 표시한다
  const { error } = use(searchParams);
  const rawOAuthError = Array.isArray(error) ? error[0] : error;
  const oauthErrorMessage =
    rawOAuthError !== undefined
      ? rawOAuthError.trim() || "소셜 로그인에 실패했습니다. 다시 시도해 주세요."
      : undefined;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    emailLogin.mutate(
      {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      },
      {
        onSuccess: () => router.replace("/"),
      },
    );
  }

  function handleOAuthLogin(provider: AuthOAuthProvider) {
    startOAuthLogin({
      provider,
      redirect: window.location.origin,
    });
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">로그인</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          이메일
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          비밀번호
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        {emailLogin.isError && (
          <p role="alert" className="text-sm text-red-600">
            {getErrorMessage(emailLogin.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={emailLogin.isPending}
          className="mt-1 rounded-md bg-gray-900 py-2 font-medium text-white disabled:opacity-50"
        >
          {emailLogin.isPending ? "로그인 중..." : "이메일로 로그인"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <hr className="flex-1 border-gray-200" />
        또는
        <hr className="flex-1 border-gray-200" />
      </div>

      <div className="flex flex-col gap-2">
        {oauthErrorMessage && emailLogin.isIdle && (
          <p role="alert" className="text-sm text-red-600">
            {oauthErrorMessage}
          </p>
        )}
        {AUTH_OAUTH_PROVIDERS.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleOAuthLogin(provider)}
            className="rounded-md border border-gray-300 py-2 font-medium capitalize"
          >
            {provider}로 계속하기
          </button>
        ))}
      </div>
    </section>
  );
}
