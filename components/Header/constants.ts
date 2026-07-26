import type { NavItem } from "./types";

// 실제 라우트가 아직 없어 "#"로 자리만 잡아둔다.
export const NAV_ITEMS: NavItem[] = [
  { label: "서열표", href: "#" },
  { label: "업데이트 기록", href: "#" },
  { label: "갱신하기", href: "#", desktopOnly: true },
];
