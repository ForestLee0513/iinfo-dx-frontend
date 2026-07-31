"use client";

import { cn } from "@forestlee0513/iinfo-dx-design-system";

import { CLEAR_LAMP_SEGMENTS } from "../constants";

export function ClearLampRatio() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold sm:text-xl">
        클리어 램프 비율 (★12 / SP)
      </h3>
      <div className="flex h-10 w-full overflow-hidden rounded-md border">
        {CLEAR_LAMP_SEGMENTS.map((segment) => (
          <div
            key={segment.id}
            className={cn("h-full", segment.swatchClassName)}
            style={{ width: `${segment.ratio}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {CLEAR_LAMP_SEGMENTS.map((segment) => (
          <div key={segment.id} className="flex items-center gap-2">
            <span
              className={cn(
                "size-4 shrink-0 rounded-sm border",
                segment.swatchClassName,
              )}
            />
            <span className="text-sm text-muted-foreground">
              {segment.label} ({segment.ratio}%)
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
