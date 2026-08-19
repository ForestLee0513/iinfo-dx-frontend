import { api } from "@/lib/axios";
import {
  IIDX_SCORES_SNAPSHOTS_URL,
  IIDX_SCORES_SUMMARY_URL,
  IIDX_SCORES_TOKEN_URL,
  IIDX_SCORES_UPLOAD_CALENDAR_URL,
  iidxScoresRestoreUrl,
} from "./constants";
import type {
  IidxPlayStyle,
  RestoreResponse,
  ScoreSummaryParams,
  ScoreSummaryResponse,
  SnapshotListResponse,
  UploadCalendarParams,
  UploadCalendarResponse,
  UploadTokenResponse,
} from "./types";

/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token
*/
export async function createUploadToken() {
  const { data } = await api.post<UploadTokenResponse>(IIDX_SCORES_TOKEN_URL);
  return data;
}

/*
GET /api/v1/iidx/scores/snapshots
성적 스냅샷 목록 - List Snapshots
*/
export async function getSnapshots(style: IidxPlayStyle) {
  const { data } = await api.get<SnapshotListResponse>(
    IIDX_SCORES_SNAPSHOTS_URL,
    { params: { style } },
  );
  return data;
}

/*
POST /api/v1/iidx/scores/restore/{upload_id}
성적 스냅샷 복구 - Restore Snapshot
*/
export async function restoreSnapshot(uploadId: string) {
  const { data } = await api.post<RestoreResponse>(
    iidxScoresRestoreUrl(uploadId),
  );
  return data;
}

/*
GET /api/v1/iidx/scores/summary
클리어 현황 요약 (클리어 램프 비율) - Get Score Summary
*/
export async function getScoreSummary({
  identifier,
  style,
  level,
}: ScoreSummaryParams) {
  const { data } = await api.get<ScoreSummaryResponse>(IIDX_SCORES_SUMMARY_URL, {
    params: { identifier, style, level },
  });
  return data;
}

/*
GET /api/v1/iidx/scores/upload-calendar
날짜별 업로드 횟수 (기여도 그래프) - Get Upload Calendar
*/
export async function getUploadCalendar({
  identifier,
  style,
  since,
  until,
  days,
  tz,
}: UploadCalendarParams) {
  const { data } = await api.get<UploadCalendarResponse>(
    IIDX_SCORES_UPLOAD_CALENDAR_URL,
    { params: { identifier, style, since, until, days, tz } },
  );
  return data;
}
