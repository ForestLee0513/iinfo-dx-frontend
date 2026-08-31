import { cn } from "@/lib/utils";
import type { SettingsTabDefinition } from "../types";

type SettingsNavItemProps = {
  tab: SettingsTabDefinition;
  active: boolean;
  onSelect: () => void;
};

export function SettingsNavItem({ tab, active, onSelect }: SettingsNavItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-secondary-foreground transition-colors",
        active ? "bg-secondary" : "hover:bg-secondary/60",
      )}
    >
      {tab.label}
    </button>
  );
}
