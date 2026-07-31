import { IconPlus } from "@tabler/icons-react";

import { Button, Separator } from "@forestlee0513/iinfo-dx-design-system";

import { UPDATE_HISTORY } from "../constants";
import { HistoryEntryCard } from "./HistoryEntryCard";

// 기여도 그래프는 차트 라이브러리 도입 전까지 자리만 잡아둔다.
export function UpdateHistory() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold sm:text-xl">갱신 기록</h3>

      <div className="flex h-56 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        기여도 그래프 영역 (준비 중)
      </div>

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
