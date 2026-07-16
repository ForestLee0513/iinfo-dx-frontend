import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthReady } from "@/providers/AuthReadyContext";
import { getMyInfo, loginWithEmail, logout, refreshSession } from "./requests";
import type { AuthLoginResponse, AuthMyInfoResponse } from "./types";

/*
쿼리 키 - Query Keys
*/
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

/*
로그인 응답의 user로 me 쿼리 캐시를 바로 채워서
로그인 직후 /me를 다시 요청하지 않아도 되게 한다
*/
export function seedMyInfo(
  queryClient: ReturnType<typeof useQueryClient>,
  { user }: AuthLoginResponse,
) {
  queryClient.setQueryData<AuthMyInfoResponse>(authKeys.me(), {
    id: user.id,
    email: user.email ?? "",
    provider: user.provider ?? "email",
    app_role: user.app_role,
  });
}

/*
POST /api/v1/web/auth/login
이메일 로그인 - Email Login
*/
export function useEmailLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithEmail,
    onSuccess: (data) => {
      seedMyInfo(queryClient, data);
    },
  });
}

/*
POST /api/v1/web/auth/refresh
세션 갱신 (쿠키 기반, 본문 불필요) - Refresh Session
*/
export function useRefreshSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: (data) => {
      seedMyInfo(queryClient, data);
    },
  });
}

/*
GET /api/v1/web/auth/me
현재 로그인 사용자 조회 - Get Current Logged-in User
*/
// staleTime Infinity — 유저 정보는 login/logout/refresh로만 갱신하므로 자동 refetch 금지.
// me 캐시는 AuthProvider 부트스트랩이 /refresh 응답으로 seed하거나(로그인),
// null로 확정한다(미로그인). 명시적 invalidate 시에만 /me를 폴백 호출한다.
export const myInfoQueryOptions = queryOptions({
  queryKey: authKeys.me(),
  queryFn: getMyInfo,
  staleTime: Infinity,
});

// 부트스트랩 완료(ready) 전에는 비활성 — 랜딩 시 /me가 토큰 없이 나가
// 401→refresh→재시도로 이어지던 레이스를 차단한다. ready 시점엔 캐시에
// 이미 데이터(객체 또는 null)가 있어 /me는 나가지 않는다.
export function useMyInfoQuery() {
  const ready = useAuthReady();
  return useQuery({ ...myInfoQueryOptions, enabled: ready });
}

/*
POST /api/v1/web/auth/logout
로그아웃 - Logout
*/
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
