import type { ClearLampCounts } from "./types";

export const IIDX_SCORES_BASE = "/api/v1/iidx/scores";
export const IIDX_SCORES_TOKEN_URL = `${IIDX_SCORES_BASE}/token`;
export const IIDX_SCORES_SNAPSHOTS_URL = `${IIDX_SCORES_BASE}/snapshots`;
export const IIDX_SCORES_SUMMARY_URL = `${IIDX_SCORES_BASE}/summary`;
export const IIDX_SCORES_UPLOAD_CALENDAR_URL = `${IIDX_SCORES_BASE}/upload-calendar`;
export const iidxScoresRestoreUrl = (uploadId: string) =>
  `${IIDX_SCORES_BASE}/restore/${uploadId}`;

// 스냅샷 조회/복구는 플레이 스타일별로 나뉜다 (백엔드 style 쿼리 파라미터: "SP" | "DP").
export const IIDX_PLAY_STYLE = {
  SP: "SP",
  DP: "DP",
} as const;

// ClearLampCounts의 8종 표준 램프를 화면에서 그릴 순서·라벨·색상으로 매핑한다.
// 클리어 램프 비율 카드, 서열표 등 램프를 색으로 표시하는 모든 화면이 이 매핑 하나를 공유한다.
export const CLEAR_LAMP_META: {
  key: keyof ClearLampCounts;
  label: string;
  swatchClassName: string;
}[] = [
  { key: "no_play", label: "NO PLAY", swatchClassName: "bg-gray-50" },
  { key: "failed", label: "FAILED", swatchClassName: "bg-red-500" },
  {
    key: "assist_clear",
    label: "ASSISTED EASY",
    swatchClassName: "bg-violet-600",
  },
  { key: "easy_clear", label: "EASY", swatchClassName: "bg-green-500" },
  { key: "clear", label: "NORMAL", swatchClassName: "bg-cyan-300" },
  { key: "hard_clear", label: "HARD", swatchClassName: "bg-white" },
  { key: "ex_hard_clear", label: "EX-HARD", swatchClassName: "bg-yellow-300" },
  { key: "full_combo", label: "FULL COMBO", swatchClassName: "bg-blue-500" },
];

// 램프의 우열 순서(약한 순) — 서열표 개인차 비교에서 두 사용자의 램프를 승패로 환산할 때 쓴다.
export const CLEAR_LAMP_ORDER: (keyof ClearLampCounts)[] = CLEAR_LAMP_META.map(
  ({ key }) => key,
);
