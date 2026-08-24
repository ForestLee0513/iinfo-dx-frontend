"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { NAV_ITEMS } from "../constants";

export function DesktopNav() {
  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
            item.desktopOnly && "hidden xl:inline",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
