export type DifficultyStat = {
  id: string;
  percentage: number;
  label: string;
  rank: string;
};

export type ClearLampSegment = {
  id: string;
  label: string;
  ratio: number;
  swatchClassName: string;
};

export type HistoryEntry = {
  id: string;
  title: string;
  difficulty: string;
  score: string;
  // 갱신으로 도달한 클리어 램프 — 카드 좌측 강조 테두리 색상을 결정한다.
  lampId: ClearLampSegment["id"];
};

// react-calendar-heatmap의 values 항목 — 날짜별 성적 추가·갱신 채보 수.
// GET /api/v1/iidx/scores/update-calendar 응답을 변환해 채운다.
export type ActivityHeatMapValue = {
  date: string;
  count: number;
  added: number;
  updated: number;
};
