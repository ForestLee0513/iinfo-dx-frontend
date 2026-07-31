"use client";
import { cn } from "@forestlee0513/iinfo-dx-design-system";

import { CLEAR_LAMP_SEGMENTS } from "../constants";
import type { HistoryEntry } from "../types";

function getLampBorderClassName(lampId: HistoryEntry["lampId"]) {
  const segment = CLEAR_LAMP_SEGMENTS.find(({ id }) => id === lampId);
  return segment?.swatchClassName;
}

export function HistoryEntryCard({
  title,
  difficulty,
  score,
  lampId,
}: HistoryEntry) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 pl-7.5! text-foreground relative">
      <span
        className={cn(
          "absolute left-0 top-0 h-full w-4 rounded-l-lg border-r",
          getLampBorderClassName(lampId),
        )}
      />
      <p className="text-xl font-normal">{title}</p>
      <div className="text-base">
        <p>난이도: {difficulty}</p>
        <p>점수: {score}</p>
      </div>
    </div>
  );
}
