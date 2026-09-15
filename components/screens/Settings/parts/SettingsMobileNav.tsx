"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { IconChevronDown } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { SettingsTabDefinition } from "../types";
import { SettingsNavItem } from "./SettingsNavItem";

// md 미만(모바일)에서만 노출되는 아코디언 네비게이션 — 접으면 현재 탭 이름 + 화살표만,
// 펼치면 사이드바와 동일한 항목 목록을 보여준다.
type SettingsMobileNavProps = {
  tabs: SettingsTabDefinition[];
};

export function SettingsMobileNav({ tabs }: SettingsMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeLabel =
    tabs.find((tab) => tab.href === pathname)?.label ?? tabs[0]?.label;

  return (
    <div className="w-full md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium text-secondary-foreground"
      >
        {activeLabel}
        <IconChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-0.5 rounded-lg border border-border p-1.5">
          {tabs.map((tab) => (
            <SettingsNavItem
              key={tab.id}
              tab={tab}
              active={tab.href === pathname}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
