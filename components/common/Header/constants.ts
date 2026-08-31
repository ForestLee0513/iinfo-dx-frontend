import type { NavItem } from "./types";

// 데스크톱 드롭다운과 모바일 사이드바가 같은 값을 쓴다.
// 프로필 라우트는 /profile/{user_id} — 백엔드 GET /api/v1/web/profile/{user_id}와 대응한다.
export const getProfileHref = (userId: string) => `/profile/${userId}`;

// 업데이트 기록은 실제 라우트가 아직 없어 "#"로 자리만 잡아둔다.
export const NAV_ITEMS: NavItem[] = [
  { label: "서열표", href: "/table" },
  { label: "업데이트 기록", href: "#" },
  { label: "갱신하기", href: "/sync" },
];
