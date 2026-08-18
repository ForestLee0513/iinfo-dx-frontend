import type { SocialLink } from "@/api/profile/types";

export type ProfileSummary = {
  identifier: string; // useProfileQuery에 넘긴 값과 동일 — 프로필 수정 성공 시 캐시 갱신 키로 쓰인다.
  handle: string | null;
  djName: string | null;
  djId: string | null;
  socialLinks: SocialLink[];
  profileImageUrl: string | null;
  isFollowing: boolean | null;
  followersCount: number;
  followingCount: number;
};

export type ProfileOverviewProps = {
  // GET /api/v1/web/profile/{user_id}의 user_id — 라우트 파라미터에서 그대로 내려온다.
  userId: string;
};

// 로그인 사용자 본인의 프로필을 조회 중인지 여부 — 팔로우/비교 등 타인 대상 액션 노출을 가른다.
// ProfileOverview가 프로필 API의 is_mine으로 판정해 하위 섹션에 내려준다.
export type OwnProfileSectionProps = {
  isOwnProfile: boolean;
};

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

// react-calendar-heatmap의 values 항목 — 날짜별 점수 갱신 횟수.
export type ActivityHeatMapValue = {
  date: string;
  count: number;
};
