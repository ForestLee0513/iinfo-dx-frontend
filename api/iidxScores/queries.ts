import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUploadToken,
  getScoreSummary,
  getScoreUpdateCalendar,
  getScoreUpdateHistory,
  getSnapshots,
  getUploadCalendar,
  restoreSnapshot,
} from "./requests";
import type {
  IidxPlayStyle,
  ScoreSummaryParams,
  ScoreUpdateCalendarParams,
  ScoreUpdateHistoryParams,
  UploadCalendarParams,
} from "./types";

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
  // 기여도 그래프는 조회 대상(identifier)·스타일·조회 구간·타임존 조합별로 캐시를 분리한다.
  uploadCalendar: (
    identifier: string,
    style: IidxPlayStyle | undefined,
    since: string | undefined,
    until: string | undefined,
    days: number | undefined,
    tz: string | undefined,
  ) =>
    [
      ...iidxScoresKeys.all,
      "uploadCalendar",
      identifier,
      style ?? "all",
      since ?? "default",
      until ?? "default",
      days ?? "default",
      tz ?? "UTC",
    ] as const,
  // 실제 성적 갱신 채보 수는 업로드 횟수와 의미가 달라 별도 캐시로 분리한다.
  updateCalendar: (
    identifier: string,
    style: IidxPlayStyle | undefined,
    since: string | undefined,
    until: string | undefined,
    days: number | undefined,
    tz: string | undefined,
  ) =>
    [
      ...iidxScoresKeys.all,
      "updateCalendar",
      identifier,
      style ?? "all",
      since ?? "default",
      until ?? "default",
      days ?? "default",
      tz ?? "UTC",
    ] as const,
  updateHistory: (
    identifier: string,
    style: IidxPlayStyle | undefined,
    perPage: number | undefined,
  ) =>
    [
      ...iidxScoresKeys.all,
      "updateHistory",
      identifier,
      style ?? "all",
      perPage ?? "default",
    ] as const,
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

/*
GET /api/v1/iidx/scores/upload-calendar
날짜별 업로드 횟수 (기여도 그래프) - Get Upload Calendar
*/
export function uploadCalendarQueryOptions({
  identifier,
  style,
  since,
  until,
  days,
  tz,
}: UploadCalendarParams) {
  return queryOptions({
    queryKey: iidxScoresKeys.uploadCalendar(identifier, style, since, until, days, tz),
    queryFn: () => getUploadCalendar({ identifier, style, since, until, days, tz }),
  });
}

// identifier가 아직 없으면(프로필 조회 전 등) 쿼리를 비활성화한다.
export function useUploadCalendarQuery(
  params: Omit<UploadCalendarParams, "identifier"> & { identifier: string | undefined },
) {
  return useQuery({
    ...uploadCalendarQueryOptions({ ...params, identifier: params.identifier ?? "" }),
    enabled: Boolean(params.identifier),
  });
}

/*
GET /api/v1/iidx/scores/update-calendar
날짜별 실제 성적 갱신 채보 수 - Get Score Update Calendar
*/
export function scoreUpdateCalendarQueryOptions({
  identifier,
  style,
  since,
  until,
  days,
  tz,
}: ScoreUpdateCalendarParams) {
  return queryOptions({
    queryKey: iidxScoresKeys.updateCalendar(identifier, style, since, until, days, tz),
    queryFn: () => getScoreUpdateCalendar({ identifier, style, since, until, days, tz }),
  });
}

// identifier가 아직 없으면(프로필 조회 전 등) 쿼리를 비활성화한다.
export function useScoreUpdateCalendarQuery(
  params: Omit<ScoreUpdateCalendarParams, "identifier"> & {
    identifier: string | undefined;
  },
) {
  return useQuery({
    ...scoreUpdateCalendarQueryOptions({ ...params, identifier: params.identifier ?? "" }),
    enabled: Boolean(params.identifier),
  });
}

/*
GET /api/v1/iidx/scores/update-history
성적 추가·갱신 이력 - Get Score Update History

"더 불러오기"가 이전 페이지를 유지한 채 다음 페이지를 이어 붙일 수 있도록
무한 쿼리로 관리한다.
*/
export function useScoreUpdateHistoryInfiniteQuery(
  params: Omit<ScoreUpdateHistoryParams, "identifier" | "page"> & {
    identifier: string | undefined;
  },
) {
  const { identifier, style, per_page } = params;

  return useInfiniteQuery({
    queryKey: iidxScoresKeys.updateHistory(identifier ?? "", style, per_page),
    queryFn: ({ pageParam }) =>
      getScoreUpdateHistory({
        identifier: identifier ?? "",
        style,
        per_page,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: Boolean(identifier),
  });
}
