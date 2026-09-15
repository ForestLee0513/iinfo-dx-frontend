import type { ReactNode } from "react";

type AccountActionRowProps = {
  title: string;
  description?: string;
  action: ReactNode;
};

export function AccountActionRow({ title, description, action }: AccountActionRowProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-border px-4 py-3 first:border-t-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
