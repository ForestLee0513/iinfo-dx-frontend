import {
  AUTH_MEMBER_ROLE,
  AUTH_OAUTH_PROMPT,
  AUTH_OAUTH_PROVIDERS,
} from "./constants";

/*
상수값 - constants
*/
export type AuthMemberRole = keyof typeof AUTH_MEMBER_ROLE;
export type AuthOAuthProvider = (typeof AUTH_OAUTH_PROVIDERS)[number];
export type AuthOAuthPrompt =
  (typeof AUTH_OAUTH_PROMPT)[keyof typeof AUTH_OAUTH_PROMPT];

/*
GET /api/v1/auth/login/{provider}
OAuth 로그인 - Oauth Login
*/
export interface AuthOAuthLoginRequest {
  provider: AuthOAuthProvider;
  redirect?: string; // 미지정 시 서버가 허용 오리진 기본값으로 폴백
  prompt?: AuthOAuthPrompt;
}

/*
POST /api/v1/auth/login
이메일 로그인 - Email Login
*/
export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  session: {
    access_token: string;
    token_type: string; // default: "bearer"
    expires_in: number | null;
  };
  user: {
    id: string;
    email: string | null;
    provider: string | null;
    app_role: AuthMemberRole; // default: "USER"
    is_public: boolean; // default: true
  };
}

/*
POST /api/v1/auth/signup
이메일 회원가입 - Sign Up
이메일 확인이 켜져 있으면 session/user 없이 email_confirmation_required: true만 반환된다.
*/
export interface AuthSignUpRequest {
  email: string;
  password: string;
  is_public?: boolean; // default: true
}

export interface AuthSignUpResponse {
  email_confirmation_required: boolean;
  session: AuthLoginResponse["session"] | null;
  user: AuthLoginResponse["user"] | null;
}

/*
POST /api/v1/auth/refresh
세션 갱신 (쿠키 기반, 본문 불필요) - Refresh Session (Cookie-based, No Body Required)
*/
export type AuthRefreshResponse = AuthLoginResponse;

/*
GET /api/v1/auth/me
현재 로그인 사용자 조회 - Get Current Logged-in User
*/
export interface AuthMyInfoResponse {
  id: string;
  email: string | null;
  provider: string | null;
  app_role: AuthMemberRole;
  is_public: boolean;
}
