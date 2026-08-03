import { api } from "@/lib/axios";
import { PROFILE_BASE, PROFILE_ME_BASE } from "./constants";
import type {
  FollowListParams,
  FollowListResponse,
  ProfileResponse,
  ProfileUpdateRequest,
} from "./types";

/*
GET /api/v1/profile/{identifier}
프로필 조회 (UUID 또는 handle) - Get Profile
*/
export async function getProfile(identifier: string) {
  const { data } = await api.get<ProfileResponse>(`${PROFILE_BASE}/${identifier}`);
  return data;
}

/*
PATCH /api/v1/profile/me
내 프로필 수정 (handle/social_links) - Update My Profile
*/
export async function updateProfile(body: ProfileUpdateRequest) {
  const { data } = await api.patch<ProfileResponse>(PROFILE_ME_BASE, body);
  return data;
}

/*
POST /api/v1/profile/{identifier}/follow
팔로우 - Follow User
*/
export async function followUser(identifier: string) {
  await api.post(`${PROFILE_BASE}/${identifier}/follow`);
}

/*
DELETE /api/v1/profile/{identifier}/follow
언팔로우 - Unfollow User
*/
export async function unfollowUser(identifier: string) {
  await api.delete(`${PROFILE_BASE}/${identifier}/follow`);
}

/*
GET /api/v1/profile/{identifier}/followers
팔로워 목록 - Get Followers
*/
export async function getFollowers(identifier: string, params?: FollowListParams) {
  const { data } = await api.get<FollowListResponse>(
    `${PROFILE_BASE}/${identifier}/followers`,
    { params },
  );
  return data;
}

/*
GET /api/v1/profile/{identifier}/following
팔로잉 목록 - Get Following
*/
export async function getFollowing(identifier: string, params?: FollowListParams) {
  const { data } = await api.get<FollowListResponse>(
    `${PROFILE_BASE}/${identifier}/following`,
    { params },
  );
  return data;
}
