/*
로그인 리다이렉트 경로 유틸 - Login Redirect Helpers

권한 가드(useAuthGuard / AuthGuard)가 미로그인 사용자를 /login으로 보낼 때
"원래 가려던 경로"를 쿼리로 실어 나르고, 로그인 페이지가 그 값을 안전하게
되돌려 받기 위한 순수 함수 모음. 화면/도메인에 묶이지 않아 lib에 둔다.
*/

// 복귀 경로를 싣는 쿼리 파라미터 이름 — 가드와 로그인 페이지가 이 상수를 공유한다.
export const RETURN_URL_PARAM = "redirect";

export const LOGIN_PATH = "/login";

/*
next.config.ts의 resolveBasePath와 같은 규칙.
basePath가 켜져 있으면 window.location.pathname에는 접두사가 붙어 있지만
router.replace()에는 접두사 없는 경로를 넘겨야 해서, 양쪽을 맞추는 데 쓴다.
*/
function getBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!raw || !raw.trim()) return "";
  let p = raw.trim();
  if (p === "/") return "";
  if (!p.startsWith("/")) p = "/" + p;
  return p.replace(/\/+$/, "");
}

/*
외부 URL로 튕겨 보내는 오픈 리다이렉트를 막는다.
- "/..." 형태의 같은 출처 경로만 통과
- "//evil.com"(프로토콜 상대 URL)과 "/\evil.com"은 차단
*/
export function sanitizeReturnUrl(
  value: string | string[] | undefined | null,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;

  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  if (!decoded.startsWith("/")) return undefined;
  if (decoded.startsWith("//") || decoded.startsWith("/\\")) return undefined;
  return decoded;
}

/*
현재 브라우저 경로(쿼리 포함, basePath 제외)를 복귀 경로로 만든다.
window에 의존하므로 effect/이벤트 핸들러 안에서만 호출할 것.
*/
export function getCurrentReturnUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const basePath = getBasePath();
  const { pathname, search } = window.location;
  const path =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;

  return `${path}${search}`;
}

// 복귀 경로가 있으면 ?redirect=...를 붙인 로그인 경로를 만든다.
export function buildLoginHref(returnUrl?: string): string {
  if (!returnUrl) return LOGIN_PATH;
  return `${LOGIN_PATH}?${RETURN_URL_PARAM}=${encodeURIComponent(returnUrl)}`;
}

/*
OAuth 복귀 경로 보관 - OAuth Return URL Handoff

OAuth 로그인은 공급자로 전체 페이지 이동이 일어나 React 상태가 전부 사라진다.
sessionStorage는 같은 탭·같은 오리진에서 살아남으므로(외부 공급자를 다녀와도 유지)
복귀 경로를 여기 맡겼다가 /auth/callback에서 꺼내 쓴다.

콜백 URL 쿼리(?redirect=)에도 같은 값을 실어 보내지만, 백엔드가 그 쿼리를
보존한다는 보장이 없어 sessionStorage를 1차 경로로 둔다.
*/
const RETURN_URL_STORAGE_KEY = "auth_return_url";

// 복귀 경로를 저장한다. 값이 없으면(일반 로그인) 이전 값을 지워 재사용을 막는다.
export function saveReturnUrl(returnUrl?: string) {
  if (typeof window === "undefined") return;
  const safe = sanitizeReturnUrl(returnUrl);
  if (safe) {
    sessionStorage.setItem(RETURN_URL_STORAGE_KEY, safe);
    return;
  }
  sessionStorage.removeItem(RETURN_URL_STORAGE_KEY);
}

// 저장된 복귀 경로를 읽기만 한다(삭제하지 않음) — 렌더 중 호출해도 안전하다.
export function peekReturnUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sanitizeReturnUrl(sessionStorage.getItem(RETURN_URL_STORAGE_KEY));
}

// 실제 이동 직전에 호출해 한 번 쓰고 버린다.
export function clearReturnUrl() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RETURN_URL_STORAGE_KEY);
}
