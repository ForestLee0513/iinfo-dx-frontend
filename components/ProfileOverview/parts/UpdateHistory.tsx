import { IconPlus } from "@tabler/icons-react";

import { Button, Separator } from "@forestlee0513/iinfo-dx-design-system";

import { UPDATE_HISTORY } from "../constants";
import { ActivityHeatMap } from "./ActivityHeatMap";
import { HistoryEntryCard } from "./HistoryEntryCard";

export function UpdateHistory() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold sm:text-xl">갱신 기록</h3>

      <ActivityHeatMap />

      <div className="flex items-center gap-3">
        <span className="text-sm whitespace-nowrap">2026.06.26 (2건)</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-3">
        {UPDATE_HISTORY.map((entry) => (
          <HistoryEntryCard key={entry.id} {...entry} />
        ))}
      </div>

      <Button variant="outline" className="w-full justify-between">
        더 불러오기
        <IconPlus className="size-4" />
      </Button>
    </section>
  );
}
