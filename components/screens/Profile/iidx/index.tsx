"use client";

import { ProfileLayout } from "@/components/screens/Profile";
import { ServiceTabs } from "@/components/common/ServiceTabs";
import { IidxProfileContent } from "./parts/IidxProfileContent";

type IidxProfileOverviewProps = {
  identifier: string;
};

// IIDX 프로필 화면은 공용 프로필 레이아웃 안에 IIDX 전용 데이터·동작·성적을 조합한다.
export function IidxProfileOverview({ identifier }: IidxProfileOverviewProps) {
  return (
    <ProfileLayout identifier={identifier}>
      {({ identifier: profileIdentifier, isOwnProfile }) => (
        <ServiceTabs iidxHref={`/iidx/profiles/${profileIdentifier}`}>
          <IidxProfileContent
            identifier={profileIdentifier}
            isOwnProfile={isOwnProfile}
          />
        </ServiceTabs>
      )}
    </ProfileLayout>
  );
}
