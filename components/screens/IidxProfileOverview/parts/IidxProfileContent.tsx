"use client";

import { isAxiosError } from "axios";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useIidxProfileQuery } from "@/api/profile/queries";
import { ClearLampRatio } from "./ClearLampRatio";
import { IidxNotSyncedNotice } from "./IidxNotSyncedNotice";
import { IidxOnboardingBanner } from "./IidxOnboardingBanner";
import { IidxProfileActions } from "./IidxProfileActions";
import { IidxProfileInfo } from "./IidxProfileInfo";
import { UpdateHistory } from "./UpdateHistory";

type IidxProfileContentProps = {
  identifier: string;
  isOwnProfile: boolean;
};

// IIDX 서비스 데이터만 조회·표시한다. 공용 프로필은 ProfileLayout이 이미 보장하므로
// IIDX 데이터가 없을 때도 이 콘텐츠 영역만 안내 화면으로 대체한다.
export function IidxProfileContent({
  identifier,
  isOwnProfile,
}: IidxProfileContentProps) {
  const profile = useIidxProfileQuery(identifier);

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
        <AlertTitle>IIDX 플레이 정보를 불러오지 못했습니다</AlertTitle>
        <AlertDescription>잠시 후 다시 시도해주세요.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <IidxProfileInfo
        profile={profile.data}
        actions={
          <IidxProfileActions
            identifier={identifier}
            isOwnProfile={isOwnProfile}
          />
        }
      />
      <ClearLampRatio userId={identifier} />
      <UpdateHistory userId={identifier} />
    </div>
  );
}
