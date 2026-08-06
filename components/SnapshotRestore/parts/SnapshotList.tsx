"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Skeleton,
} from "@forestlee0513/iinfo-dx-design-system";

import type { IidxPlayStyle } from "@/api/iidxScores/types";
import { useSnapshotsQuery } from "@/api/iidxScores/queries";
import { SnapshotRow } from "./SnapshotRow";

interface SnapshotListProps {
  style: IidxPlayStyle;
}

// 특정 플레이 스타일(SP/DP)의 스냅샷 목록을 불러와 행으로 렌더링한다.
export function SnapshotList({ style }: SnapshotListProps) {
  const { data, isPending, isError } = useSnapshotsQuery(style);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>목록을 불러오지 못했습니다.</EmptyTitle>
          <EmptyDescription>잠시 후 다시 시도해주세요.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (data.snapshots.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>복구할 스냅샷이 없습니다.</EmptyTitle>
          <EmptyDescription>
            갱신하기에서 성적을 업로드하면 이곳에 이력이 쌓입니다.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-md border">
      {data.snapshots.map((snapshot) => (
        <SnapshotRow key={snapshot.upload_id} style={style} snapshot={snapshot} />
      ))}
    </ul>
  );
}
