"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useProfileQuery } from "@/api/profile/queries";
import { useAuthReady } from "@/providers/AuthReadyContext";
import { ProfileIdentity } from "./parts/ProfileIdentity";
import type { ProfileLayoutProps } from "./types";

const CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-6 sm:py-10 xl:px-12! xl:py-12";

// 플랫폼 공통 프로필(식별 정보·팔로우·온보딩)만 담당한다. 서비스 데이터와 콘텐츠는
// children에서 서비스별로 렌더링해, 특정 서비스가 없어도 공용 프로필은 유지된다.
export function ProfileLayout({ identifier, children }: ProfileLayoutProps) {
  const ready = useAuthReady();
  const router = useRouter();
  const profile = useProfileQuery(ready ? identifier : undefined);
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
            identifier={identifier}
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

        <div className="min-w-0 flex-1">
          {children({ identifier, isOwnProfile })}
        </div>
      </div>
    </div>
  );
}
