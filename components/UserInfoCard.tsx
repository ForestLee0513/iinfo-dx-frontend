"use client";

import { isAxiosError } from "axios";
import Link from "next/link";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/requests";

export function UserInfoCard() {
  const myInfo = useMyInfoQuery();
  const logout = useLogoutMutation();

  if (myInfo.isPending) {
    return (
      <section className="w-full max-w-sm rounded-lg border border-gray-200 p-4 text-sm text-gray-500">
        사용자 정보를 불러오는 중...
      </section>
    );
  }

  if (myInfo.isError) {
    const isUnauthorized =
      isAxiosError(myInfo.error) && myInfo.error.response?.status === 401;

    return (
      <section className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-gray-200 p-4 text-sm">
        <p className="text-gray-500">
          {isUnauthorized
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

  return (
    <section className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-gray-200 p-4 text-sm">
      <h2 className="font-bold">내 정보</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-gray-500">이메일</dt>
        <dd>{myInfo.data.email}</dd>
        <dt className="text-gray-500">가입 경로</dt>
        <dd>{myInfo.data.provider}</dd>
        <dt className="text-gray-500">권한</dt>
        <dd>{myInfo.data.app_role}</dd>
        <dt className="text-gray-500">ID</dt>
        <dd className="break-all">{myInfo.data.id}</dd>
      </dl>
      <button
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="rounded-md bg-gray-900 py-2 text-center font-medium text-white disabled:opacity-50"
      >
        {logout.isPending ? "로그아웃 중..." : "로그아웃"}
      </button>
    </section>
  );
}
