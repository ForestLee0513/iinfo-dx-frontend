"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

type IidxVisibilityRowProps = {
  // IIDX 온보딩을 하지 않은 사용자에게도 행 자체는 보여주되, 끈 상태로 잠근다.
  isMember: boolean;
  disabled: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
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

// 서비스별 공개 여부는 PATCH /profile/me의 service_visibility에 포함해 다른 프로필
// 정보와 함께 저장한다.
export function IidxVisibilityRow({
  isMember,
  disabled,
  checked,
  onCheckedChange,
}: IidxVisibilityRowProps) {
  if (!isMember) {
    return <NotJoinedRow />;
  }

  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>IIDX</FieldTitle>
        <FieldDescription>IIDX 서비스 프로필 공개 여부입니다.</FieldDescription>
      </FieldContent>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label="IIDX 프로필 공개 여부"
      />
    </Field>
  );
}
