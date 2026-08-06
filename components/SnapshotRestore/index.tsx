"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@forestlee0513/iinfo-dx-design-system";

import { IIDX_PLAY_STYLE } from "@/api/iidxScores/constants";
import { SnapshotList } from "./parts/SnapshotList";

// 성적 스냅샷(업로드 이력) 목록을 SP/DP별로 보여주고, 원하는 시점으로 복구한다.
export function SnapshotRestore() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-6 xl:px-12! xl:py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">복구하기</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        지난 갱신 이력 중 원하는 시점을 선택해 현재 성적으로 복구할 수 있습니다.
      </p>

      <Tabs defaultValue={IIDX_PLAY_STYLE.SP} className="mt-4">
        <TabsList variant="line">
          <TabsTrigger value={IIDX_PLAY_STYLE.SP}>SP</TabsTrigger>
          <TabsTrigger value={IIDX_PLAY_STYLE.DP}>DP</TabsTrigger>
        </TabsList>

        <TabsContent value={IIDX_PLAY_STYLE.SP} className="mt-4">
          <SnapshotList style={IIDX_PLAY_STYLE.SP} />
        </TabsContent>

        <TabsContent value={IIDX_PLAY_STYLE.DP} className="mt-4">
          <SnapshotList style={IIDX_PLAY_STYLE.DP} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
