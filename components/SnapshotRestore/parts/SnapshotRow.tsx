"use client";

import { toast } from "sonner";

import { Badge, Button } from "@forestlee0513/iinfo-dx-design-system";

import type { IidxPlayStyle, SnapshotSummary } from "@/api/iidxScores/types";
import { useRestoreSnapshotMutation } from "@/api/iidxScores/queries";
import { formatSnapshotDate } from "../utils";

interface SnapshotRowProps {
  style: IidxPlayStyle;
  snapshot: SnapshotSummary;
}

// 스냅샷 1건 = 목록의 한 행. 왼쪽에 날짜/메타, 오른쪽에 복구 버튼을 둔다.
export function SnapshotRow({ style, snapshot }: SnapshotRowProps) {
  const { mutate, isPending } = useRestoreSnapshotMutation(style);

  const handleRestore = () => {
    mutate(snapshot.upload_id, {
      onSuccess: () => toast.success("해당 스냅샷으로 복구되었습니다."),
      onError: () => toast.error("복구에 실패했습니다. 잠시 후 다시 시도해주세요."),
    });
  };

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {formatSnapshotDate(snapshot.uploaded_at)}
          </span>
          {snapshot.is_current && (
            <Badge variant="secondary" className="shrink-0">
              현재
            </Badge>
          )}
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {snapshot.source} · {snapshot.song_count}곡
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleRestore}
        disabled={isPending || snapshot.is_current}
        className="shrink-0"
      >
        {isPending ? "복구 중..." : "복구하기"}
      </Button>
    </li>
  );
}
