import type { IIDX_PLAY_STYLE } from "./constants";

/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token

북마크릿에서 사용할 단기 업로드 토큰을 발급한다 (1시간 유효).
*/
export interface UploadTokenResponse {
  token: string;
  expires_in: number;
}

// "SP" | "DP"
export type IidxPlayStyle =
  (typeof IIDX_PLAY_STYLE)[keyof typeof IIDX_PLAY_STYLE];

/*
GET /api/v1/iidx/scores/snapshots
성적 스냅샷 목록 - List Snapshots

업로드 이력 하나가 스냅샷 하나에 대응한다.
*/
export interface SnapshotSummary {
  upload_id: string;
  play_style: string;
  source: string;
  song_count: number;
  uploaded_at: string; // ISO date-time
  is_current: boolean; // 현재 활성 스냅샷 여부
}

export interface SnapshotListResponse {
  snapshots: SnapshotSummary[];
  current_upload_id: string | null;
}

/*
POST /api/v1/iidx/scores/restore/{upload_id}
성적 스냅샷 복구 - Restore Snapshot
*/
export interface RestoreResponse {
  upload_id: string;
  play_style: string;
  applied_at: string; // ISO date-time
}

/*
GET /api/v1/iidx/scores/summary
클리어 현황 요약 (클리어 램프 비율) - Get Score Summary
*/
export interface ScoreSummaryParams {
  identifier: string; // 대상 유저의 UUID 또는 handle
  style: IidxPlayStyle;
  level?: number; // 생략하면 해당 스타일 전체 레벨 합산
}

// 레벨/스타일 기준 클리어 램프별 채보 개수 (8종 표준 램프).
export interface ClearLampCounts {
  no_play: number;
  failed: number;
  assist_clear: number;
  easy_clear: number;
  clear: number;
  hard_clear: number;
  ex_hard_clear: number;
  full_combo: number;
}

// ClearLampCounts와 동일한 키의 비율(%, 소수 1자리). total=0이면 전부 0.0.
export type ClearLampPercentages = Record<keyof ClearLampCounts, number>;

export interface ScoreSummaryResponse {
  play_style: string;
  level: number | null;
  total: number;
  counts: ClearLampCounts;
  percentages: ClearLampPercentages;
  // level 필터와 무관하게 해당 스타일에 존재하는 전체 레벨 목록 — 난이도 선택 UI 구성용.
  available_levels: number[];
}
