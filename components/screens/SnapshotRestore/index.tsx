"use client";

import Link from "next/link";
import { IconRefresh } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IIDX_PLAY_STYLE } from "@/api/iidxScores/constants";
import { ServiceTabs } from "@/components/common/ServiceTabs";
import { SnapshotList } from "./parts/SnapshotList";

// 성적 스냅샷(업로드 이력) 목록을 SP/DP별로 보여주고, 원하는 시점으로 복구한다.
export function SnapshotRestore() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-6 xl:px-12! xl:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          복구하기
        </h1>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/iidx/score-updates" />}
        >
          <IconRefresh className="size-4" />
          갱신하기
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        지난 갱신 이력 중 원하는 시점을 선택해 현재 성적으로 복구할 수 있습니다.
      </p>

      <ServiceTabs iidxHref="/iidx/score-snapshots" className="mt-6">
        <Tabs defaultValue={IIDX_PLAY_STYLE.SP}>
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
      </ServiceTabs>
    </main>
  );
}
