"use client";

import { isAxiosError } from "axios";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Skeleton,
} from "@forestlee0513/iinfo-dx-design-system";

import { useIidxProfileQuery, useProfileQuery } from "@/api/profile/queries";
import { useAuthReady } from "@/providers/AuthReadyContext";
import { ClearLampRatio } from "./parts/ClearLampRatio";
import { DifficultyProgress } from "./parts/DifficultyProgress";
import { HandleOnboardingBanner } from "./parts/HandleOnboardingBanner";
import { IidxOnboardingBanner } from "./parts/IidxOnboardingBanner";
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
  const profile = useIidxProfileQuery(ready ? userId : undefined);

  // IIDX 프로필 404 시 — 유저 자체가 없는 경우와 미온보딩을 구분하기 위해 base 프로필을 추가로 조회한다.
  const iidxNotFound =
    profile.isError &&
    isAxiosError(profile.error) &&
    profile.error.response?.status === 404;
  const baseProfile = useProfileQuery(iidxNotFound ? userId : undefined);

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
    // IIDX 404 + base 프로필 조회 중 → 스켈레톤으로 대기
    if (iidxNotFound && baseProfile.isPending) {
      return (
        <div className={CONTAINER_CLASS_NAME}>
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }

    // IIDX 404 + 본인 프로필 → 미온보딩 상태
    if (iidxNotFound && baseProfile.isSuccess && baseProfile.data.is_mine) {
      return (
        <div className={CONTAINER_CLASS_NAME}>
          <IidxOnboardingBanner />
        </div>
      );
    }

    // 그 외(base 프로필도 없거나 네트워크 오류 등)
    return (
      <div className={CONTAINER_CLASS_NAME}>
        <Alert variant="destructive">
          <AlertTitle>
            {iidxNotFound ? "프로필을 찾을 수 없습니다" : "프로필을 불러오지 못했습니다"}
          </AlertTitle>
          <AlertDescription>
            {iidxNotFound
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

      {isOwnProfile && !profile.data.handle && (
        <div className="mt-6">
          <HandleOnboardingBanner identifier={userId} />
        </div>
      )}

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
          <ClearLampRatio userId={ready ? userId : undefined} />
          <UpdateHistory />
        </div>
      </div>
    </div>
  );
}
