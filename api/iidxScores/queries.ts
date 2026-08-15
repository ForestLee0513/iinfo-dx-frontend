import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUploadToken,
  getScoreSummary,
  getSnapshots,
  restoreSnapshot,
} from "./requests";
import type { IidxPlayStyle, ScoreSummaryParams } from "./types";

/*
쿼리 키 - Query Keys
*/
export const iidxScoresKeys = {
  all: ["iidxScores"] as const,
  // 스냅샷 목록은 플레이 스타일(SP/DP)별로 캐시를 분리한다.
  snapshots: (style: IidxPlayStyle) =>
    [...iidxScoresKeys.all, "snapshots", style] as const,
  // 클리어 현황 요약은 조회 대상(identifier)·스타일·레벨 조합별로 캐시를 분리한다.
  summary: (identifier: string, style: IidxPlayStyle, level: number | undefined) =>
    [...iidxScoresKeys.all, "summary", identifier, style, level ?? "all"] as const,
};

/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token
*/
export function useCreateUploadTokenMutation() {
  return useMutation({
    mutationFn: createUploadToken,
  });
}

/*
GET /api/v1/iidx/scores/snapshots
성적 스냅샷 목록 - List Snapshots
*/
export function snapshotsQueryOptions(style: IidxPlayStyle) {
  return queryOptions({
    queryKey: iidxScoresKeys.snapshots(style),
    queryFn: () => getSnapshots(style),
  });
}

export function useSnapshotsQuery(style: IidxPlayStyle) {
  return useQuery(snapshotsQueryOptions(style));
}

/*
POST /api/v1/iidx/scores/restore/{upload_id}
성적 스냅샷 복구 - Restore Snapshot

복구 성공 시 활성 스냅샷(is_current)이 바뀌므로, 해당 스타일의 목록 캐시를
무효화해 최신 상태로 다시 불러온다.
*/
export function useRestoreSnapshotMutation(style: IidxPlayStyle) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uploadId: string) => restoreSnapshot(uploadId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: iidxScoresKeys.snapshots(style),
      });
    },
  });
}

/*
GET /api/v1/iidx/scores/summary
클리어 현황 요약 (클리어 램프 비율) - Get Score Summary
*/
export function summaryQueryOptions({ identifier, style, level }: ScoreSummaryParams) {
  return queryOptions({
    queryKey: iidxScoresKeys.summary(identifier, style, level),
    queryFn: () => getScoreSummary({ identifier, style, level }),
  });
}

// identifier가 아직 없으면(프로필 조회 전 등) 쿼리를 비활성화한다.
export function useScoreSummaryQuery(
  params: Omit<ScoreSummaryParams, "identifier"> & { identifier: string | undefined },
) {
  return useQuery({
    ...summaryQueryOptions({ ...params, identifier: params.identifier ?? "" }),
    enabled: Boolean(params.identifier),
  });
}
