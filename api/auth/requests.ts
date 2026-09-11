import { api, setAccessToken } from "@/lib/axios";
import { AUTH_BASE, AUTH_OAUTH_PROVIDER_PROMPT } from "./constants";
import type {
  AuthMyInfoResponse,
  AuthOAuthLoginRequest,
  AuthRefreshResponse,
} from "./types";

/*
GET /api/v1/auth/login/{provider}
OAuth 로그인 - OAuth Login
XHR이 아닌 전체 페이지 리다이렉트로 진입해야 하며,
공급자 인증 완료 후 콜백(redirect)에서 세션 쿠키가 설정된다
*/
export function getOAuthLoginUrl({
  provider,
  redirect,
  prompt,
}: AuthOAuthLoginRequest) {
  const query = new URLSearchParams();
  if (redirect) query.set("redirect", redirect);
  // prompt 미지정 시 공급자별 기본값 적용
  const promptValue = prompt ?? AUTH_OAUTH_PROVIDER_PROMPT[provider];
  if (promptValue) query.set("prompt", promptValue);
  const qs = query.toString();
  return `${api.defaults.baseURL}${AUTH_BASE}/login/${provider}${qs ? `?${qs}` : ""}`;
}

export function startOAuthLogin(request: AuthOAuthLoginRequest) {
  window.location.assign(getOAuthLoginUrl(request));
}

/*
POST /api/v1/auth/refresh
세션 갱신 (쿠키 기반, 본문 불필요) - Refresh Session
*/
export async function refreshSession() {
  const { data } = await api.post<AuthRefreshResponse>(`${AUTH_BASE}/refresh`);
  setAccessToken(data.session.access_token);
  return data;
}

/*
GET /api/v1/auth/me
현재 로그인 사용자 조회 - Get Current Logged-in User
*/
// 반환 타입에 null을 포함 — /me 자체는 항상 객체지만, me 캐시는 미로그인 시
// AuthProvider가 null로 확정하므로 캐시/쿼리 데이터 타입을 nullable로 넓힌다.
export async function getMyInfo(): Promise<AuthMyInfoResponse | null> {
  const { data } = await api.get<AuthMyInfoResponse>(`${AUTH_BASE}/me`);
  return data;
}

/*
POST /api/v1/auth/logout
로그아웃 - Logout
성공 시 서버가 세션 쿠키를 제거한다 (withCredentials 필수)
*/
export async function logout() {
  await api.post(`${AUTH_BASE}/logout`);
  setAccessToken(null);
}

/*
DELETE /api/v1/auth/me
회원 탈퇴 (계정 영구 삭제) - Withdraw
성공 시 서버가 refresh 쿠키를 함께 제거한다
*/
export async function withdrawAccount() {
  await api.delete(`${AUTH_BASE}/me`);
  setAccessToken(null);
}
