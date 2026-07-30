import type { NavItem } from "./types";

// 프로필 라우트도 아직 없어 자리만 잡아둔다. 데스크톱 드롭다운과 모바일 사이드바가 같은 값을 쓴다.
export const PROFILE_HREF = "#";

// 실제 라우트가 아직 없어 "#"로 자리만 잡아둔다.
export const NAV_ITEMS: NavItem[] = [
  { label: "서열표", href: "#" },
  { label: "업데이트 기록", href: "#" },
  { label: "갱신하기", href: "#", desktopOnly: true },
];
