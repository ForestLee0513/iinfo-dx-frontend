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
GET /api/v1/web/auth/login/{provider}
OAuth 로그인 - Oauth Login
*/
export interface AuthOAuthLoginRequest {
  provider: AuthOAuthProvider; // ex) "google", "github", "kakao"
  redirect: string; // ex) "https://example.com/oauth/callback"
  prompt?: AuthOAuthPrompt; // ex) "consent", "select_account" — 미지정 시 공급자 기본 동작
}

/*
POST /api/v1/web/auth/login
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
    expires_in?: number;
  };
  user: {
    id: string;
    email?: string;
    provider?: string;
    app_role: AuthMemberRole; // default: "USER"
  };
}

/*
POST /api/v1/web/auth/signup
이메일 회원가입 - Sign Up
*/
export interface AuthSignUpRequest {
  email: string;
  password: string;
}

export interface AuthSignUpResponse extends AuthLoginResponse {
  email_confirmation_required: boolean;
}

/*
POST /api/v1/web/auth/refresh
세션 갱신 (쿠키 기반, 본문 불필요) - Refresh Session (Cookie-based, No Body Required)
*/
export type AuthRefreshResponse = AuthLoginResponse;

/*
GET /api/v1/web/auth/me 
현재 로그인 사용자 조회 - Get Current Logged-in User
*/
export interface AuthMyInfoResponse {
  id: string;
  email: string;
  provider: string;
  app_role: AuthMemberRole;
}
