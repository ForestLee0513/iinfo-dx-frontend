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
