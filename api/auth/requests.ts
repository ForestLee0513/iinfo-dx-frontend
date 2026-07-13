import { api, setAccessToken } from "@/lib/axios";
import { AUTH_BASE, AUTH_OAUTH_PROVIDER_PROMPT } from "./constants";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthMyInfoResponse,
  AuthOAuthLoginRequest,
  AuthRefreshResponse,
} from "./types";

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

/*
POST /api/v1/web/auth/logout
로그아웃 - Logout
성공 시 서버가 세션 쿠키를 제거한다 (withCredentials 필수)
*/
export async function logout() {
  await api.post(`${AUTH_BASE}/logout`);
  setAccessToken(null);
}
