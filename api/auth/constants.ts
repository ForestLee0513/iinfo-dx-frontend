export const AUTH_BASE = "/api/v1/web/auth";

export const AUTH_MEMBER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const AUTH_OAUTH_PROVIDERS = ["google"] as const;

/*
OIDC 표준 prompt 값 (공급자 authorize URL에 그대로 전달됨)
공급자별 지원 범위가 다르므로 새 공급자 추가 시 해당 문서 확인 필요
- none: 인증/동의 UI 없이 조용히 진행, 활성 세션이 없으면 에러 반환
- login: 기존 세션이 있어도 재인증(자격 증명 재입력) 강제
- consent: 동의 화면 강제
- select_account: 계정 선택 화면 강제
*/
export const AUTH_OAUTH_PROMPT = {
  NONE: "none",
  LOGIN: "login",
  CONSENT: "consent",
  SELECT_ACCOUNT: "select_account",
} as const;

/*
공급자별로 로그인 시 전달할 prompt 값 (미대응 공급자는 null)
AUTH_OAUTH_PROVIDERS에 공급자를 추가하면 이 매핑도 함께 갱신해야 한다 (satisfies로 강제됨)
참고: kakao/github/microsoft는 select_account 지원, apple/facebook은 prompt 무시,
discord는 none/consent만 인식하므로 추가 시 공식 문서 확인 필요
*/
export const AUTH_OAUTH_PROVIDER_PROMPT = {
  google: AUTH_OAUTH_PROMPT.SELECT_ACCOUNT,
} as const satisfies Record<
  (typeof AUTH_OAUTH_PROVIDERS)[number],
  (typeof AUTH_OAUTH_PROMPT)[keyof typeof AUTH_OAUTH_PROMPT] | null
>;
