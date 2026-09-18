"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useProfileQuery } from "@/api/profile/queries";
import { ServiceTabs } from "@/components/common/ServiceTabs";
import { useAuthReady } from "@/providers/AuthReadyContext";
import { IidxTabContent } from "./parts/IidxTabContent";
import { ProfileIdentity } from "./parts/ProfileIdentity";
import type { ProfileOverviewProps } from "./types";

const CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-6 sm:py-10 xl:px-12! xl:py-12";

// Figma 프로필 화면(1920/1280/320 너비 목업)을 하나의 반응형 레이아웃으로 구현한다.
// xl 미만에서는 단일 컬럼으로 쌓이고, xl 이상에서 프로필 정보가 좌측 사이드바로 분리된다.
//
// 공용 프로필(useProfileQuery)이 기준 데이터다 — 이전에는 IIDX 프로필을 기준으로 조회해
// IIDX 데이터가 없는 사용자는 공용 프로필(사이드바)조차 볼 수 없었다. 서비스별 프로필
// 조회는 콘텐츠 영역의 탭(IidxTabContent)으로 분리해, 특정 서비스에 데이터가 없어도
// 사이드바와 탭 구조는 항상 렌더된다. 서비스 탭은 ServiceTabs가 공통으로 제공한다.
export function ProfileOverview({ userId }: ProfileOverviewProps) {
  // 세션 복원(/refresh)이 끝나기 전에 조회하면 Authorization 없이 나가 is_mine이
  // 항상 false로 캐시된다 — AuthProvider 부트스트랩이 끝난 뒤에만 요청한다.
  const ready = useAuthReady();
  const router = useRouter();
  const profile = useProfileQuery(ready ? userId : undefined);

  // 본인 프로필 + 핸들 미등록 → 온보딩으로 이동. is_mine으로 판정하므로 로그인 후
  // 타인의 프로필만 잠깐 둘러보는 경우(자신의 프로필을 조회하지 않는 한)에는 걸리지 않는다.
  const needsOnboarding =
    profile.isSuccess && profile.data.is_mine && !profile.data.handle;

  useEffect(() => {
    if (needsOnboarding) {
      router.replace("/onboarding");
    }
  }, [needsOnboarding, router]);

  if (profile.isPending || needsOnboarding) {
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
    return (
      <div className={CONTAINER_CLASS_NAME}>
        <Alert variant="destructive">
          <AlertTitle>프로필을 찾을 수 없습니다</AlertTitle>
          <AlertDescription>
            존재하지 않거나 비공개로 설정된 프로필입니다.
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
            nickname={profile.data.nickname}
            socialLinks={profile.data.social_links}
            profileImageUrl={profile.data.profile_image_url}
            isFollowing={profile.data.is_following}
            followersCount={profile.data.followers_count}
            followingCount={profile.data.following_count}
            isOwnProfile={isOwnProfile}
          />
        </div>

        {/* min-w-0: flex 아이템의 기본 min-width는 auto라 내부 콘텐츠(기여도
        히트맵 등)가 넓어지면 이 컬럼이 줄어들지 못하고 페이지 전체가 가로로
        밀린다 — min-w-0으로 풀어야 내부 overflow-x-auto가 실제로 스크롤을 맡는다. */}
        <div className="min-w-0 flex-1">
          <ServiceTabs>
            <IidxTabContent
              userId={ready ? userId : undefined}
              isOwnProfile={isOwnProfile}
            />
          </ServiceTabs>
        </div>
      </div>
    </div>
  );
}
