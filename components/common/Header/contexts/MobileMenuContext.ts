"use client";

import { createContext, useContext } from "react";

import type { MobileMenuContextValue } from "../types";

// 모바일 Sheet의 열림 상태는 index.tsx가 소유하고, parts는 close()만 소비한다.
// (SheetClose로 처리할 수 없는 비동기 액션 — 로그아웃 완료 후 닫기 — 을 위해 필요)
export const MobileMenuContext = createContext<MobileMenuContextValue | null>(
  null,
);

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);

  if (!context) {
    throw new Error("useMobileMenu는 MobileMenuContext 내부에서만 사용할 수 있다.");
  }

  return context;
}
