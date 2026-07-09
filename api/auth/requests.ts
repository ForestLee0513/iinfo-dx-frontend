import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api, setAccessToken } from "@/lib/axios";
import { useAuthReady } from "@/providers/auth-ready-context";
import { AUTH_BASE, AUTH_OAUTH_PROVIDER_PROMPT } from "./constants";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthMyInfoResponse,
  AuthOAuthLoginRequest,
  AuthRefreshResponse,
} from "./types";

/*
쿼리 키 - Query Keys
*/
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

/*
POST /api/v1/web/auth/login
이메일 로그인 - Email Login
성공 시 서버가 세션 쿠키를 설정한다 (withCredentials 필수)
*/
export async function loginWithEmail(body: AuthLoginRequest) {
  const { data } = await api.post<AuthLoginResponse>(
    `${AUTH_BASE}/login`,
    body,
  );
  setAccessToken(data.session.access_token);
  return data;
}

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
GET /api/v1/web/auth/login/{provider}
OAuth 로그인 - OAuth Login
XHR이 아닌 전체 페이지 리다이렉트로 진입해야 하며,
공급자 인증 완료 후 콜백(redirect)에서 세션 쿠키가 설정된다
*/
export function getOAuthLoginUrl({
  provider,
  redirect,
  prompt,
}: AuthOAuthLoginRequest) {
  const query = new URLSearchParams({ redirect });
  // prompt 미지정 시 공급자별 기본값 적용
  const promptValue = prompt ?? AUTH_OAUTH_PROVIDER_PROMPT[provider];
  if (promptValue) query.set("prompt", promptValue);
  return `${api.defaults.baseURL}${AUTH_BASE}/login/${provider}?${query}`;
}

export function startOAuthLogin(request: AuthOAuthLoginRequest) {
  window.location.assign(getOAuthLoginUrl(request));
}

/*
POST /api/v1/web/auth/refresh
세션 갱신 (쿠키 기반, 본문 불필요) - Refresh Session
*/
export async function refreshSession() {
  const { data } = await api.post<AuthRefreshResponse>(`${AUTH_BASE}/refresh`);
  setAccessToken(data.session.access_token);
  return data;
}

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
// 반환 타입에 null을 포함 — /me 자체는 항상 객체지만, me 캐시는 미로그인 시
// AuthProvider가 null로 확정하므로 캐시/쿼리 데이터 타입을 nullable로 넓힌다.
export async function getMyInfo(): Promise<AuthMyInfoResponse | null> {
  const { data } = await api.get<AuthMyInfoResponse>(`${AUTH_BASE}/me`);
  return data;
}

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
성공 시 서버가 세션 쿠키를 제거한다 (withCredentials 필수)
*/
export async function logout() {
  await api.post(`${AUTH_BASE}/logout`);
  setAccessToken(null);
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
