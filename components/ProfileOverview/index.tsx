"use client";

import { isAxiosError } from "axios";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Skeleton,
} from "@forestlee0513/iinfo-dx-design-system";

import { useProfileQuery } from "@/api/profile/queries";
import { useAuthReady } from "@/providers/AuthReadyContext";
import { ClearLampRatio } from "./parts/ClearLampRatio";
import { DifficultyProgress } from "./parts/DifficultyProgress";
import { ProfileIdentity } from "./parts/ProfileIdentity";
import { UpdateHistory } from "./parts/UpdateHistory";
import type { ProfileOverviewProps } from "./types";

const CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-[1440px] px-4 py-8 md:px-6 xl:px-12! xl:py-12";

// Figma 프로필 화면(1920/1280/320 너비 목업)을 하나의 반응형 레이아웃으로 구현한다.
// xl 미만에서는 단일 컬럼으로 쌓이고, xl 이상에서 프로필 정보가 좌측 사이드바로 분리된다.
//
// 프로필 조회/수정 API는 identity 영역(handle/DJ NAME·ID/소셜 링크/프로필 이미지)까지
// 커버한다. 난이도 통계·클리어 램프 비율·갱신 기록은 대응하는 API가 아직 없어 목업을 유지한다.
export function ProfileOverview({ userId }: ProfileOverviewProps) {
  // 세션 복원(/refresh)이 끝나기 전에 조회하면 Authorization 없이 나가 is_mine이
  // 항상 false로 캐시된다 — AuthProvider 부트스트랩이 끝난 뒤에만 요청한다.
  const ready = useAuthReady();
  const profile = useProfileQuery(ready ? userId : undefined);

  if (profile.isPending) {
    return (
      <div className={CONTAINER_CLASS_NAME}>
        <Skeleton className="h-10 w-32" />
        <div className="mt-8 flex flex-col gap-10 xl:flex-row! xl:items-start xl:gap-16">
          <Skeleton className="h-80 w-full xl:w-80 xl:shrink-0" />
          <Skeleton className="h-96 flex-1" />
        </div>
      </div>
    );
  }

  if (profile.isError) {
    // 서버는 프로필이 없거나 비공개인 경우를 구분하지 않고 404로 통일해 존재 여부를 감춘다.
    const isNotFound =
      isAxiosError(profile.error) && profile.error.response?.status === 404;

    return (
      <div className={CONTAINER_CLASS_NAME}>
        <Alert variant="destructive">
          <AlertTitle>
            {isNotFound ? "프로필을 찾을 수 없습니다" : "프로필을 불러오지 못했습니다"}
          </AlertTitle>
          <AlertDescription>
            {isNotFound
              ? "존재하지 않거나 비공개로 설정된 프로필입니다."
              : "잠시 후 다시 시도해주세요."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwnProfile = profile.data.is_mine;

  return (
    <div className={CONTAINER_CLASS_NAME}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">프로필</h1>

      <div className="mt-8 flex flex-col gap-10 xl:flex-row! xl:items-start xl:gap-16">
        <div className="xl:w-80 xl:shrink-0">
          <ProfileIdentity
            identifier={userId}
            handle={profile.data.handle}
            djName={profile.data.dj_name}
            djId={profile.data.dj_id}
            socialLinks={profile.data.social_links}
            profileImageUrl={profile.data.profile_image_url}
            isFollowing={profile.data.is_following}
            followersCount={profile.data.followers_count}
            followingCount={profile.data.following_count}
            isOwnProfile={isOwnProfile}
          />
        </div>

        <div className="flex flex-1 flex-col gap-10">
          <DifficultyProgress isOwnProfile={isOwnProfile} />
          <ClearLampRatio />
          <UpdateHistory />
        </div>
      </div>
    </div>
  );
}
