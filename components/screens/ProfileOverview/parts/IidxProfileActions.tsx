import Link from "next/link";
import { IconArrowsExchange, IconHistory, IconRefresh } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

type IidxProfileActionsProps = {
  identifier: string | undefined;
  isOwnProfile: boolean;
};

// IIDX 데이터와 직접 관련된 행동은 공용 프로필 사이드바가 아닌 IIDX 탭에 모은다.
export function IidxProfileActions({
  identifier,
  isOwnProfile,
}: IidxProfileActionsProps) {
  if (isOwnProfile) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row" aria-label="IIDX 관리">
        <Button
          className="w-full sm:w-auto"
          nativeButton={false}
          render={<Link href="/iidx/sync" />}
        >
          <IconRefresh className="size-4" />
          갱신하기
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          nativeButton={false}
          render={<Link href="/iidx/restore" />}
        >
          <IconHistory className="size-4" />
          복구하기
        </Button>
      </div>
    );
  }

  if (!identifier) return null;

  return (
    <Button
      className="w-full sm:w-auto"
      nativeButton={false}
      render={<Link href={`/iidx/table/compare/${identifier}`} />}
    >
      <IconArrowsExchange className="size-4" />
      서열표 비교하기
    </Button>
  );
}
