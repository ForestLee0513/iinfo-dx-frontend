import type { ClearLampSegment, DifficultyStat, HistoryEntry } from "./types";

// 램프 색상 매핑은 iidxScores 도메인 소유 — 서열표 등 다른 화면과 공유한다.
export { CLEAR_LAMP_META } from "@/api/iidxScores/constants";

// 난이도 통계/집계 API가 아직 없어 Figma 목업과 동일한 값으로 화면만 먼저 채운다.
export const DIFFICULTY_STATS: DifficultyStat[] = [
  {
    id: "normal",
    percentage: 60,
    label: "노말(그루브) 게이지",
    rank: "상위 10%",
  },
  { id: "hard", percentage: 1, label: "하드 게이지", rank: "상위 99%" },
];

export const CLEAR_LAMP_SEGMENTS: ClearLampSegment[] = [
  {
    id: "no-play",
    label: "NO PLAY",
    ratio: 23.3,
    swatchClassName: "bg-muted-foreground/40",
  },
  { id: "failed", label: "FAILED", ratio: 7.4, swatchClassName: "bg-red-500" },
  {
    id: "assisted-easy",
    label: "ASSISTED EASY",
    ratio: 7.1,
    swatchClassName: "bg-violet-600",
  },
  { id: "easy", label: "EASY", ratio: 30, swatchClassName: "bg-green-500" },
  {
    id: "normal-lamp",
    label: "NORMAL",
    ratio: 8.2,
    swatchClassName: "bg-cyan-300",
  },
  { id: "hard-lamp", label: "HARD", ratio: 13, swatchClassName: "bg-white" },
  {
    id: "ex-hard",
    label: "EX-HARD",
    ratio: 7.3,
    swatchClassName: "bg-yellow-300",
  },
  {
    id: "full-combo",
    label: "FULL COMBO",
    ratio: 3.7,
    swatchClassName: "bg-blue-500",
  },
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
