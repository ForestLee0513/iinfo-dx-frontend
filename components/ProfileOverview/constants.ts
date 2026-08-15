import type { ClearLampCounts } from "@/api/iidxScores/types";
import type { ClearLampSegment, DifficultyStat, HistoryEntry } from "./types";

// GET /api/v1/iidx/scores/summary 응답(counts/percentages)의 8종 표준 램프를
// 클리어 램프 비율 카드에서 그릴 순서·라벨·색상으로 매핑한다.
export const CLEAR_LAMP_META: {
  key: keyof ClearLampCounts;
  label: string;
  swatchClassName: string;
}[] = [
  { key: "no_play", label: "NO PLAY", swatchClassName: "bg-muted-foreground/40" },
  { key: "failed", label: "FAILED", swatchClassName: "bg-red-500" },
  { key: "assist_clear", label: "ASSISTED EASY", swatchClassName: "bg-violet-600" },
  { key: "easy_clear", label: "EASY", swatchClassName: "bg-green-500" },
  { key: "clear", label: "NORMAL", swatchClassName: "bg-cyan-300" },
  { key: "hard_clear", label: "HARD", swatchClassName: "bg-white" },
  { key: "ex_hard_clear", label: "EX-HARD", swatchClassName: "bg-yellow-300" },
  { key: "full_combo", label: "FULL COMBO", swatchClassName: "bg-blue-500" },
];

// 난이도 통계/집계 API가 아직 없어 Figma 목업과 동일한 값으로 화면만 먼저 채운다.
export const DIFFICULTY_STATS: DifficultyStat[] = [
  { id: "normal", percentage: 60, label: "노말(그루브) 게이지", rank: "상위 10%" },
  { id: "hard", percentage: 1, label: "하드 게이지", rank: "상위 99%" },
];

export const CLEAR_LAMP_SEGMENTS: ClearLampSegment[] = [
  { id: "no-play", label: "NO PLAY", ratio: 23.3, swatchClassName: "bg-muted-foreground/40" },
  { id: "failed", label: "FAILED", ratio: 7.4, swatchClassName: "bg-red-500" },
  { id: "assisted-easy", label: "ASSISTED EASY", ratio: 7.1, swatchClassName: "bg-violet-600" },
  { id: "easy", label: "EASY", ratio: 30, swatchClassName: "bg-green-500" },
  { id: "normal-lamp", label: "NORMAL", ratio: 8.2, swatchClassName: "bg-cyan-300" },
  { id: "hard-lamp", label: "HARD", ratio: 13, swatchClassName: "bg-white" },
  { id: "ex-hard", label: "EX-HARD", ratio: 7.3, swatchClassName: "bg-yellow-300" },
  { id: "full-combo", label: "FULL COMBO", ratio: 3.7, swatchClassName: "bg-blue-500" },
];

export const UPDATE_HISTORY: HistoryEntry[] = [
  {
    id: "mendes",
    title: "MENDES",
    difficulty: "SPA",
    score: "A 2600(+183)",
    lampId: "hard-lamp",
  },
  {
    id: "verflucht",
    title: "Verflucht",
    difficulty: "SPA",
    score: "A 2600(+183)",
    lampId: "easy",
  },
];
