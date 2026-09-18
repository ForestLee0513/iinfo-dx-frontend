"use client";

import { useMemo } from "react";
import { IconPlus, IconRefresh } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useScoreUpdateHistoryInfiniteQuery } from "@/api/iidxScores/queries";
import type { ScoreUpdateHistoryItem } from "@/api/iidxScores/types";
import { ActivityHeatMap } from "./ActivityHeatMap";

type UpdateHistoryProps = {
  userId: string | undefined;
};

const HISTORY_PAGE_SIZE = 10;

function formatUpdateDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}. ${month}. ${day}`;
}

function getLocalDate(isoDateTime: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(isoDateTime))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

type UpdatesByDate = [string, ScoreUpdateHistoryItem[]][];

type UpdateEventProps = {
  count: number;
  type: "added" | "updated";
};

// Figma의 40px 아이콘 + 한 줄 설명 이벤트다. 한 번의 동기화에 신규·갱신이
// 함께 있으면 각 변화를 독립 행으로 보여줘 변경 성격을 바로 구분할 수 있다.
function UpdateEvent({ count, type }: UpdateEventProps) {
  const isAdded = type === "added";
  const Icon = isAdded ? IconPlus : IconRefresh;

  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="text-xs">
        {isAdded
          ? `${count}개의 클리어 기록 추가됨`
          : `${count}개의 클리어 기록이 갱신됨`}
      </p>
    </div>
  );
}

export function UpdateHistory({ userId }: UpdateHistoryProps) {
  const updateHistory = useScoreUpdateHistoryInfiniteQuery({
    identifier: userId,
    per_page: HISTORY_PAGE_SIZE,
  });

  // 최신순 이력을 사용자가 보는 로컬 날짜 기준으로 묶어 Figma의
  // "날짜 (n건) → 갱신 카드" 구조를 만든다.
  const updatesByDate = useMemo(
    () => {
      const entries =
        updateHistory.data?.pages
          .flatMap((page) => page.items)
          .filter((item) => item.added > 0 || item.updated > 0) ?? [];
      const groups = new Map<string, ScoreUpdateHistoryItem[]>();
      entries.forEach((item) => {
        const date = getLocalDate(item.uploaded_at);
        groups.set(date, [...(groups.get(date) ?? []), item]);
      });
      return Array.from(groups.entries()) as UpdatesByDate;
    },
    [updateHistory.data?.pages],
  );

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="text-base font-semibold">갱신 기록</h3>

      <ActivityHeatMap userId={userId} />

      {updateHistory.isPending ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-36" />
        </div>
      ) : updateHistory.isError ? (
        <p className="text-sm text-muted-foreground">
          성적 갱신 기록을 불러오지 못했습니다.
        </p>
      ) : updatesByDate.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 성적 갱신 기록이 없습니다.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {updatesByDate.map(([date, items]) => (
              <div key={date} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs whitespace-nowrap">{formatUpdateDate(date)}</span>
                  <Separator className="flex-1" />
                </div>
                {items.flatMap((item) => [
                  ...(item.added > 0
                    ? [
                        <UpdateEvent
                          key={`${item.upload_id}-added`}
                          count={item.added}
                          type="added"
                        />,
                      ]
                    : []),
                  ...(item.updated > 0
                    ? [
                        <UpdateEvent
                          key={`${item.upload_id}-updated`}
                          count={item.updated}
                          type="updated"
                        />,
                      ]
                    : []),
                ])}
              </div>
            ))}
          </div>

          {updateHistory.hasNextPage && (
            <Button
              variant="outline"
              className="w-full"
              disabled={updateHistory.isFetchingNextPage}
              onClick={() => updateHistory.fetchNextPage()}
            >
              {updateHistory.isFetchingNextPage ? "불러오는 중..." : "더 불러오기"}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
