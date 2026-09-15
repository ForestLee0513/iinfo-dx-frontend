"use client";

import { isAxiosError } from "axios";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useIidxProfileQuery } from "@/api/profile/queries";
import { ClearLampRatio } from "./ClearLampRatio";
import { IidxNotSyncedNotice } from "./IidxNotSyncedNotice";
import { IidxOnboardingBanner } from "./IidxOnboardingBanner";
import { UpdateHistory } from "./UpdateHistory";

type IidxTabContentProps = {
  userId: string | undefined;
  isOwnProfile: boolean;
};

// "IIDX" 탭 패널 — 서비스 프로필(IIDX) 조회는 이 탭 안에서만 이뤄진다. 공용 프로필
// 조회(ProfileOverview)와 분리해뒀기 때문에, 여기서 404가 나도 사이드바/탭 구조 자체는
// 그대로 유지된 채 탭 내용만 갱신 안내로 바뀐다.
export function IidxTabContent({ userId, isOwnProfile }: IidxTabContentProps) {
  const profile = useIidxProfileQuery(userId);

  if (profile.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const notFound =
    profile.isError &&
    isAxiosError(profile.error) &&
    profile.error.response?.status === 404;

  if (notFound) {
    // 본인 → 갱신 방법 안내 + CTA. 타인 → 미갱신 사실만 알림(대신 갱신해줄 수 없음).
    return isOwnProfile ? <IidxOnboardingBanner /> : <IidxNotSyncedNotice />;
  }

  if (profile.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>IIDX 정보를 불러오지 못했습니다</AlertTitle>
        <AlertDescription>잠시 후 다시 시도해주세요.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ClearLampRatio userId={userId} />
      <UpdateHistory userId={userId} />
    </div>
  );
}
