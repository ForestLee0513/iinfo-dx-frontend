import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { IidxProfileResponse } from "@/api/profile/types";

type IidxProfileInfoProps = {
  profile: IidxProfileResponse;
  actions?: ReactNode;
};

// 서비스별 식별 정보는 공용 프로필이 아닌 해당 서비스 탭에서만 보여준다. 서비스가
// 늘어나면 각 탭이 같은 역할의 정보 블록을 자체 데이터 모델에 맞춰 추가한다.
export function IidxProfileInfo({ profile, actions }: IidxProfileInfoProps) {
  return (
    <Card size="sm" className="rounded-xl shadow-none">
      <CardHeader className="flex flex-col gap-3 sm:grid">
        <CardTitle className="text-lg">IIDX 프로필</CardTitle>
        {actions && <CardAction className="w-full sm:w-auto">{actions}</CardAction>}
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">
              DJ NAME
            </dt>
            <dd className="text-sm font-medium">{profile.dj_name ?? "-"}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">DJ ID</dt>
            <dd className="text-sm font-medium">{profile.dj_id ?? "-"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
