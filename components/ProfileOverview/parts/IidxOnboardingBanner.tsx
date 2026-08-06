import Link from "next/link";
import { IconDatabaseX } from "@tabler/icons-react";

import { buttonVariants } from "@forestlee0513/iinfo-dx-design-system";

export function IidxOnboardingBanner() {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <IconDatabaseX className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">IIDX 데이터 갱신이 필요합니다</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              아직 등록된 IIDX 플레이 데이터가 없습니다.
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium">갱신하는 방법</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>갱신하기 페이지에서 북마크릿 스크립트를 저장하세요</li>
            <li>e-Amusement에서 북마크릿 스크립트를 실행해 갱신을 완료하세요</li>
          </ul>
        </div>

        <div>
          <Link href="/sync" className={buttonVariants()}>
            갱신하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
