import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  followUser,
  getFollowers,
  getFollowing,
  getProfile,
  unfollowUser,
  updateProfile,
} from "./requests";
import type { FollowListParams, ProfileResponse } from "./types";

/*
쿼리 키 - Query Keys
*/
export const profileKeys = {
  all: ["profile"] as const,
  detail: (identifier: string) => [...profileKeys.all, identifier] as const,
  followers: (identifier: string) =>
    [...profileKeys.detail(identifier), "followers"] as const,
  following: (identifier: string) =>
    [...profileKeys.detail(identifier), "following"] as const,
};

/*
프로필 수정 응답으로 조회 중인 프로필의 캐시를 바로 채워서
저장 직후 GET을 다시 요청하지 않아도 되게 한다
*/
export function seedProfile(
  queryClient: ReturnType<typeof useQueryClient>,
  identifier: string,
  data: ProfileResponse,
) {
  queryClient.setQueryData<ProfileResponse>(profileKeys.detail(identifier), data);
}

/*
GET /api/v1/profile/{identifier}
프로필 조회 (UUID 또는 handle) - Get Profile
*/
export function profileQueryOptions(identifier: string) {
  return queryOptions({
    queryKey: profileKeys.detail(identifier),
    queryFn: () => getProfile(identifier),
  });
}

// identifier가 아직 없으면(라우트 파라미터 확정 전 등) 쿼리를 비활성화한다.
export function useProfileQuery(identifier: string | undefined) {
  return useQuery({
    ...profileQueryOptions(identifier ?? ""),
    enabled: Boolean(identifier),
  });
}

/*
GET /api/v1/profile/{identifier}/followers
팔로워 목록 - Get Followers
*/
export function useFollowersQuery(
  identifier: string | undefined,
  params?: FollowListParams,
) {
  return useQuery({
    queryKey: [...(profileKeys.followers(identifier ?? "")), params],
    queryFn: () => getFollowers(identifier!, params),
    enabled: Boolean(identifier),
  });
}

/*
GET /api/v1/profile/{identifier}/following
팔로잉 목록 - Get Following
*/
export function useFollowingQuery(
  identifier: string | undefined,
  params?: FollowListParams,
) {
  return useQuery({
    queryKey: [...(profileKeys.following(identifier ?? "")), params],
    queryFn: () => getFollowing(identifier!, params),
    enabled: Boolean(identifier),
  });
}

/*
PATCH /api/v1/profile/me
내 프로필 수정 (handle/social_links) - Update My Profile

identifier는 현재 조회 중인 프로필의 쿼리 키(useProfileQuery에 넘긴 값과 동일해야
한다) — 저장 성공 시 그 캐시만 갱신한다. me API 응답이라 다른 identifier(예: 변경
전 handle)로 조회된 캐시는 갱신하지 않는다.
*/
export function useUpdateProfileMutation(identifier: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      seedProfile(queryClient, identifier, data);
    },
  });
}

/*
POST/DELETE /api/v1/profile/{identifier}/follow
팔로우/언팔로우 - Follow/Unfollow User

둘 다 204만 반환해 갱신된 프로필을 다시 내려주지 않으므로, 조회 중인 프로필 캐시의
is_following/followers_count를 직접 갱신한다. mutate에 다음 팔로우 상태(true=팔로우,
false=언팔로우)를 넘긴다.
*/
export function useToggleFollowMutation(identifier: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextFollowing: boolean) =>
      nextFollowing ? followUser(identifier) : unfollowUser(identifier),
    onSuccess: (_data, nextFollowing) => {
      queryClient.setQueryData<ProfileResponse>(profileKeys.detail(identifier), (prev) =>
        prev && prev.is_following !== nextFollowing
          ? {
              ...prev,
              is_following: nextFollowing,
              followers_count: prev.followers_count + (nextFollowing ? 1 : -1),
            }
          : prev,
      );
    },
  });
}
