"use client";

import Link from "next/link";

import { useMobileMenu } from "../contexts/MobileMenuContext";
import { NAV_ITEMS } from "../constants";

// 링크 클릭 시 사이드바를 함께 닫는다.
// (SheetClose로 감싸면 Base UI가 <a>에 button 시맨틱을 씌우므로 close()를 직접 호출한다)
export function MobileNav() {
  const { close } = useMobileMenu();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={close}
          className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
