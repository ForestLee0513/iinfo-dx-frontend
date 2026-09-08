"use client";

import { use } from "react";

import { Login } from "@/components/screens/Login";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string | string[];
    redirect?: string | string[];
  }>;
}) {
  // OAuth 실패 시 백엔드가 ?error=<한글 메시지>를 붙여 홈으로 돌려보내고,
  // app/page.tsx가 이 페이지로 전달한다
  const { error, redirect } = use(searchParams);
  return <Login error={error} redirect={redirect} />;
}
