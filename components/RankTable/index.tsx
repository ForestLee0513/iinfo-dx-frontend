"use client";

import { useState } from "react";

import { Skeleton } from "@forestlee0513/iinfo-dx-design-system";

import { useTableBoardQuery, useTablesQuery } from "@/api/iidxTables/queries";
import { useAuthReady } from "@/providers/AuthReadyContext";
import { ComparisonSummary } from "./parts/ComparisonSummary";
import { DifficultyTableSelect } from "./parts/DifficultyTableSelect";
import { RankSectionBlock } from "./parts/RankSectionBlock";
import type { RankTableOpponent } from "./types";

const CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-[1440px] px-4 py-8 md:px-6 xl:px-12! xl:py-12";

type RankTableProps = {
  // 있으면 비교 모드 — 각 채보 행에 상대 램프를 함께 표시하고 상단에 우열 요약을 보여준다.
  // 클리어 램프는 로그인 사용자의 개인 성적이라, 비로그인이면 비교 모드여도 무시하고
  // 곡 리스트만 보여준다(백엔드가 user=null일 때 그렇게 응답한다).
  opponent?: RankTableOpponent;
};

// 서열표/서열표(비교) 화면(Figma 1080/720/320 목업)을 하나의 반응형 레이아웃으로 구현한다.
// GET /api/v1/iidx/tables, GET /api/v1/iidx/tables/{slug}/board 연동.
export function RankTable({ opponent }: RankTableProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>();

  const tables = useTablesQuery();
  const activeSlug = selectedSlug ?? tables.data?.tables[0]?.slug;

  // 세션 복원(/refresh)이 끝나기 전에 조회하면 Authorization 없이 나가 로그인 사용자도
  // 비로그인으로 캐시된다 — AuthProvider 부트스트랩이 끝난 뒤에만 요청한다.
  const ready = useAuthReady();
  const board = useTableBoardQuery({
    slug: ready ? activeSlug : undefined,
    opponent: opponent?.identifier,
  });

  // 램프 표시 여부는 백엔드 판정을 그대로 따른다 — 로그인 사용자의 성적이 있을 때만 user가 채워진다.
  const showLamp = Boolean(board.data?.user);
  const showComparison = showLamp && Boolean(board.data?.opponent && board.data.comparison);

  return (
    <div className={CONTAINER_CLASS_NAME}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">서열표</h1>
        {opponent &&
          (board.isPending ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            showComparison &&
            board.data?.opponent &&
            board.data.comparison && (
              <ComparisonSummary
                opponent={board.data.opponent}
                comparison={board.data.comparison}
              />
            )
          ))}
      </div>

      {!board.isPending && !showLamp && (
        <p className="mt-2 text-sm text-muted-foreground">
          로그인하면 채보별 클리어 램프를 확인할 수 있습니다.
        </p>
      )}

      <div className="mt-6">
        {tables.isPending ? (
          <Skeleton className="h-10 w-full sm:w-64" />
        ) : tables.isError || !tables.data ? (
          <p className="text-sm text-muted-foreground">
            난이도표 목록을 불러오지 못했습니다.
          </p>
        ) : (
          <DifficultyTableSelect
            tables={tables.data.tables}
            value={activeSlug}
            onValueChange={setSelectedSlug}
          />
        )}
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {board.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : board.isError ? (
          <p className="text-sm text-muted-foreground">
            서열표를 불러오지 못했습니다.
          </p>
        ) : board.data.sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            아직 준비되지 않은 난이도표입니다.
          </p>
        ) : (
          board.data.sections.map((section) => (
            <RankSectionBlock
              key={section.id}
              section={section}
              showLamp={showLamp}
              showComparison={showComparison}
            />
          ))
        )}
      </div>
    </div>
  );
}
