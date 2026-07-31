import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getProfile, updateProfile } from "./requests";
import type { ProfileResponse } from "./types";

/*
쿼리 키 - Query Keys
*/
export const profileKeys = {
  all: ["profile"] as const,
  detail: (identifier: string) => [...profileKeys.all, identifier] as const,
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
GET /api/v1/web/profile/{identifier}
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
PATCH /api/v1/web/profile/me
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
