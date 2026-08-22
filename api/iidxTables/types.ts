/*
GET /api/v1/iidx/tables
난이도표 목록 조회 - List Tables
*/
export interface TableSummary {
  slug: string;
  name: string;
  source: string;
  play_style: string;
  rating_type: string;
  level: number | null;
  grades: string[] | null;
  updated_at: string; // ISO date-time
}

export interface TableListResponse {
  tables: TableSummary[];
}

/*
GET /api/v1/iidx/tables/{slug}/board
난이도표 서열표 (클리어 램프 / 사용자 비교) - Get Table Board

- 비로그인: identifier 없이 호출하면 user=null, 모든 엔트리 score=null로 곡 목록만 내려온다.
- 로그인: identifier를 생략하면 토큰의 사용자 본인 성적을 사용한다.
- 비교 모드: opponent를 함께 넘기면 각 엔트리에 opponent_score가 채워지고 comparison에 승/패/무·승률이 담긴다.
  램프 서열: NO PLAY < FAILED < ASSIST < EASY < NORMAL < HARD < EX-HARD < FULL COMBO.
*/
export interface TableBoardParams {
  slug: string;
  identifier?: string; // 램프를 표시할 대상 유저의 UUID 또는 handle. 생략하면 로그인 사용자 본인.
  opponent?: string; // 비교 대상 유저의 UUID 또는 handle. 지정하면 비교 모드.
}

// 서열표의 주체/비교 대상 사용자 요약.
export interface BoardUser {
  user_id: string;
  handle: string | null;
  dj_name: string | null;
}

// 엔트리 하나에 매칭된 사용자 성적 (매칭 실패/미플레이면 상위에서 null).
export interface BoardScore {
  clear_lamp: string; // ClearLampCounts와 동일한 8종 표준 램프 키
  dj_level: string | null;
  ex_score: number | null;
  level: number | null;
  last_played_at: string | null; // ISO date-time
}

// 서열표 한 줄 — 표 엔트리 + 본인/상대 성적.
export interface BoardEntry {
  id: number;
  title: string;
  series: string | null;
  play_style: string;
  difficulty: string;
  level: number | null;
  grade: string | null;
  rating: number | null;
  table_type: string | null;
  score: BoardScore | null;
  opponent_score: BoardScore | null;
}

// 서열표 섹션 — GRADE 표는 등급(+지력/개인차), NUMERIC 표는 rating 단위.
export interface BoardSection {
  id: string;
  title: string;
  grade: string | null;
  rating: number | null;
  table_type: string | null;
  entries: BoardEntry[];
}

// 본인 vs 상대 램프 우열 집계 (비교 모드에서만).
export interface BoardComparison {
  total: number;
  win: number;
  lose: number;
  draw: number;
  win_rate: number | null;
}

export interface TableBoardResponse {
  slug: string;
  name: string;
  source: string;
  play_style: string;
  rating_type: string;
  level: number | null;
  grades: string[] | null;
  updated_at: string; // ISO date-time
  user: BoardUser | null;
  opponent: BoardUser | null;
  total_entries: number;
  sections: BoardSection[];
  comparison: BoardComparison | null;
}
