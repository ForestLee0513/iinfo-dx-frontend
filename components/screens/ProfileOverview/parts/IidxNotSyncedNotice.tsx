import { IconDatabaseX } from "@tabler/icons-react";

// 타인의 프로필에서 IIDX 데이터가 아직 없을 때 노출 — 본인 전용 갱신 안내(IidxOnboardingBanner)와
// 달리 갱신 CTA를 보여줄 수 없으므로(타인이 대신 갱신할 수 없다) 미갱신 사실만 짧게 알린다.
export function IidxNotSyncedNotice() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-5 sm:p-6">
      <IconDatabaseX className="size-5 shrink-0 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        해당 사용자는 IIDX의 플레이 데이터를 갱신하지 않았거나 비공개 처리된
        사용자입니다.
      </p>
    </div>
  );
}
