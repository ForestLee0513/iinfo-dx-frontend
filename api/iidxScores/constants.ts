export const IIDX_SCORES_BASE = "/api/v1/iidx/scores";
export const IIDX_SCORES_TOKEN_URL = `${IIDX_SCORES_BASE}/token`;
export const IIDX_SCORES_SNAPSHOTS_URL = `${IIDX_SCORES_BASE}/snapshots`;
export const IIDX_SCORES_SUMMARY_URL = `${IIDX_SCORES_BASE}/summary`;
export const iidxScoresRestoreUrl = (uploadId: string) =>
  `${IIDX_SCORES_BASE}/restore/${uploadId}`;

// 스냅샷 조회/복구는 플레이 스타일별로 나뉜다 (백엔드 style 쿼리 파라미터: "SP" | "DP").
export const IIDX_PLAY_STYLE = {
  SP: "SP",
  DP: "DP",
} as const;
