"use client";

import { toast } from "sonner";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import { useIidxProfileQuery, useUpdateIidxProfileMutation } from "@/api/profile/queries";

type IidxVisibilityRowProps = {
  identifier: string;
  // IIDX 온보딩을 하지 않은 사용자에게도 행 자체는 보여주되, 끈 상태로 잠근다.
  isMember: boolean;
  // 전체 프로필이 비공개면 서비스별 설정은 의미가 없어(어차피 비공개로 취급) 잠근다.
  disabled: boolean;
};

// 미가입 상태(또는 조회 실패)일 때 보여주는 잠긴 행 — 토글 자체는 항상 노출하되 끈
// 상태로 고정한다.
function NotJoinedRow() {
  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>IIDX</FieldTitle>
        <FieldDescription>가입되지 않은 서비스입니다.</FieldDescription>
      </FieldContent>
      <Switch checked={false} disabled aria-label="IIDX 프로필 공개 여부" />
    </Field>
  );
}

// 서비스별 공개 여부(iidx_is_public)는 PATCH /profile/iidx/me로 저장되는 별개
// 리소스라, 정보 변경 폼의 저장 버튼과 묶지 않고 토글 자체가 즉시 저장한다.
export function IidxVisibilityRow({ identifier, isMember, disabled }: IidxVisibilityRowProps) {
  // 미가입 상태면 iidx 프로필 자체가 없어(404) 조회할 필요가 없다.
  const profile = useIidxProfileQuery(isMember ? identifier : undefined);
  const updateIidxProfile = useUpdateIidxProfileMutation(identifier);

  if (!isMember) {
    return <NotJoinedRow />;
  }

  if (profile.isPending) {
    return <Skeleton className="h-10 w-full" />;
  }

  // isMember=true인데도 404 등으로 실패하면(레이스 컨디션 등) 미가입과 동일하게 보여준다.
  if (profile.isError) {
    return <NotJoinedRow />;
  }

  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>IIDX</FieldTitle>
        <FieldDescription>IIDX 서비스 프로필 공개 여부입니다.</FieldDescription>
      </FieldContent>
      <Switch
        checked={profile.data.iidx_is_public}
        disabled={disabled || updateIidxProfile.isPending}
        onCheckedChange={(checked) =>
          updateIidxProfile.mutate(
            { is_public: checked },
            { onError: () => toast.error("IIDX 공개 여부 변경에 실패했습니다.") },
          )
        }
        aria-label="IIDX 프로필 공개 여부"
      />
    </Field>
  );
}
