import Link from "next/link";

import type { SignInPromptProps } from "../types";

// 미인증/조회 실패 시 로그인 유도 카드
export function SignInPrompt({ unauthorized }: SignInPromptProps) {
  return (
    <section className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-gray-200 p-4 text-sm">
      <p className="text-gray-500">
        {unauthorized
          ? "로그인되어 있지 않습니다."
          : "사용자 정보를 가져오지 못했습니다."}
      </p>
      <Link
        href="/login"
        className="rounded-md bg-gray-900 py-2 text-center font-medium text-white"
      >
        로그인하러 가기
      </Link>
    </section>
  );
}
