import Link from "next/link";

import { NAV_ITEMS } from "../constants";

export function MobileNav() {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
