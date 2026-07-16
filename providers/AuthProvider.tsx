"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { refreshSession } from "@/api/auth/requests";
import { authKeys, seedMyInfo } from "@/api/auth/queries";
import type { AuthMyInfoResponse } from "@/api/auth/types";
import { getAccessToken } from "@/lib/axios";
import { AuthReadyContext } from "@/providers/AuthReadyContext";

/*
랜딩 시 세션을 한 번 복원한다.
access token은 메모리에만 있어 새로고침하면 사라지므로, httpOnly refresh
쿠키로 /refresh를 1회 호출해 토큰을 되살리고 그 응답의 user로 me 캐시를 seed한다.
→ /me를 따로 조회하지 않아 랜딩 요청이 3회(/me→refresh→/me)에서 1회로 준다.
*/
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // 마운트 시 메모리에 이미 토큰이 있으면(로그인 직후 client 네비게이션) 곧바로 ready.
  // 로그인 mutation이 me 캐시를 채워둔 상태이므로 refresh가 불필요하다.
  // 새로고침/OAuth 랜딩에서는 토큰이 없어 false로 시작 → 아래 effect가 복원한다.
  const [ready, setReady] = useState(() => getAccessToken() !== null);

  useEffect(() => {
    if (ready) return;

    let active = true;
    refreshSession()
      .then((data) => seedMyInfo(queryClient, data))
      .catch(() =>
        // refresh 실패(쿠키 없음/만료) = 미로그인 확정
        queryClient.setQueryData<AuthMyInfoResponse | null>(
          authKeys.me(),
          null,
        ),
      )
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, [ready, queryClient]);

  return (
    <AuthReadyContext.Provider value={ready}>
      {children}
    </AuthReadyContext.Provider>
  );
}
