import { PROFILE_USER_ROLE } from "./constants";

/*
상수값 - constants
*/
export type ProfileUserRole = keyof typeof PROFILE_USER_ROLE;

// 소셜 링크 1건 — {platform, url}.
export interface SocialLink {
  platform: string;
  url: string;
}

/*
GET /api/v1/profile/{identifier}
프로필 조회 (UUID 또는 handle) - Get Profile

- identifier가 UUID면 user_id로, 아니면 handle로 조회한다(UUID도 handle 패턴도
  아니면 DB 조회 없이 바로 404).
- user_profiles에 행이 없으면(가입 트리거 도입 이전 계정 등) 404.
- is_public=false인 비공개 프로필은 본인만 조회 가능 — 그 외엔 404로 존재 자체를 감춘다.
- 요청 토큰의 sub가 조회된 user_id와 같을 때만 is_mine=true와 함께 email/provider가 채워진다.
- is_following은 로그인한 타인이 볼 때만 값이 채워진다(익명/본인 조회는 null).
*/
export interface ProfileResponse {
  id: string;
  handle: string | null;
  role: ProfileUserRole; // default: "USER"
  is_public: boolean; // default: true
  social_links: SocialLink[];
  dj_name: string | null;
  dj_id: string | null;
  profile_image_url: string | null;
  updated_at: string | null;
  is_mine: boolean; // default: false
  email: string | null; // is_mine=true일 때만 값이 채워짐
  provider: string | null; // is_mine=true일 때만 값이 채워짐
  followers_count: number; // default: 0
  following_count: number; // default: 0
  is_following: boolean | null; // 로그인 사용자의 팔로우 여부 — 미로그인/본인 조회 시 null
}

/*
POST /api/v1/profile/{identifier}/follow
팔로우 - Follow User
이미 팔로우 중이면 그대로 성공(멱등) — 204 No Content

DELETE /api/v1/profile/{identifier}/follow
언팔로우 - Unfollow User
팔로우 중이 아니었어도 성공(멱등) — 204 No Content
*/

/*
PATCH /api/v1/profile/me
내 프로필 수정 (handle/social_links) - Update My Profile

본문에 없는 필드는 그대로 유지된다(부분 업데이트). handle을 null로 보내면 핸들을
해제하고, 이미 다른 사용자가 쓰는 handle이면 409. social_links는 보낸 배열로
통째로 치환된다(부분 추가/삭제가 아님).
*/
export interface ProfileUpdateRequest {
  handle?: string | null;
  social_links?: SocialLink[] | null;
}

/*
GET /api/v1/profile/{identifier}/followers
팔로워 목록 - Get Followers

GET /api/v1/profile/{identifier}/following
팔로잉 목록 - Get Following
*/
export interface FollowListParams {
  page?: number; // default: 1, min: 1
  per_page?: number; // default: 20, min: 1, max: 100
}

export interface FollowUserSummary {
  id: string;
  handle: string | null;
  profile_image_url: string | null;
}

export interface FollowListResponse {
  users: FollowUserSummary[];
  page: number;
  per_page: number;
  total: number;
}

/*
GET /api/v1/profile/iidx/{identifier}
IIDX 서비스 프로필 조회 - Get IIDX Profile

- iidx.profiles 행이 없으면(미온보딩) 404.
- iidx_is_public=false인 비공개 프로필은 본인만 조회 가능(404로 은닉).
- is_public은 플랫폼 수준, iidx_is_public은 IIDX 서비스 수준 공개 여부다.
*/
export interface IidxProfileResponse extends ProfileResponse {
  iidx_is_public: boolean; // default: true
}

/*
PATCH /api/v1/profile/iidx/me
내 IIDX 서비스 프로필 공개 여부 수정 - Update My IIDX Profile

iidx.profiles 행이 없으면(미온보딩) 404.
플랫폼 수준 공개 여부 수정은 PATCH /profile/me를 사용할 것.
*/
export interface IidxProfileUpdateRequest {
  is_public?: boolean | null;
}
