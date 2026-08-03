import { IconAt } from "@tabler/icons-react";

import { HandleSetupDialog } from "./HandleSetupDialog";

type HandleOnboardingBannerProps = {
  identifier: string;
};

export function HandleOnboardingBanner({
  identifier,
}: HandleOnboardingBannerProps) {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <IconAt className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">핸들을 등록하여 프로필을 완성하세요</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              서비스를 이용하기 위해서 핸들을 등록해야 합니다.
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium">핸들이란?</p>
          <p className="mt-1 text-muted-foreground">
            핸들(<code className="text-foreground">@handle</code>)은 IInfo
            DX에서 나를 나타내는 고유한 식별자입니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              나만의 프로필 URL로 공유할 수 있어요 —{" "}
              <code className="text-foreground">/profile/username</code>
            </li>
            <li>다른 사용자가 핸들로 나를 검색하고 팔로우할 수 있어요</li>
            <li>
              라이벌 등록, 성과 비교 등 서비스 핵심 기능을 이용할 수 있어요
            </li>
          </ul>
        </div>

        <div>
          <HandleSetupDialog identifier={identifier} />
        </div>
      </div>
    </div>
  );
}
