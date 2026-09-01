import Link from "next/link";

import { cn } from "@/lib/utils";
import type { SettingsTabDefinition } from "../types";

type SettingsNavItemProps = {
  tab: SettingsTabDefinition;
  active: boolean;
  onClick?: () => void;
};

export function SettingsNavItem({ tab, active, onClick }: SettingsNavItemProps) {
  return (
    <Link
      href={tab.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-secondary-foreground transition-colors",
        active ? "bg-secondary" : "hover:bg-secondary/60",
      )}
    >
      {tab.label}
    </Link>
  );
}
