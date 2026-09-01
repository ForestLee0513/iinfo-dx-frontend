"use client";

import { usePathname } from "next/navigation";

import { SETTINGS_TABS } from "../constants";
import { SettingsNavItem } from "./SettingsNavItem";

// md 이상(태블릿/데스크톱)에서만 노출되는 세로 사이드바 — 모바일은 SettingsMobileNav가 대신한다.
export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-[180px] shrink-0 flex-col gap-1 md:flex xl:w-[240px]">
      {SETTINGS_TABS.map((tab) => (
        <SettingsNavItem key={tab.id} tab={tab} active={pathname === tab.href} />
      ))}
    </nav>
  );
}
