"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useUpdateProfileMutation } from "@/api/profile/queries";

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? "닉네임 변경에 실패했습니다.";
  }
  return "닉네임 변경에 실패했습니다.";
}

type NicknamePanelProps = {
  identifier: string;
  nickname: string | null;
};

export function NicknamePanel({ identifier, nickname }: NicknamePanelProps) {
  const [value, setValue] = useState(nickname ?? "");
  const updateProfile = useUpdateProfileMutation(identifier);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    updateProfile.mutate(
      { nickname: trimmed || null },
      { onSuccess: () => toast.success("닉네임이 변경되었습니다.") },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">닉네임 변경</p>
      <div className="w-full rounded-lg border border-border p-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="settings-nickname">닉네임</FieldLabel>
            <Input
              id="settings-nickname"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="예: 홍길동"
              maxLength={30}
            />
          </Field>
          {updateProfile.isError && (
            <FieldError errors={[{ message: getErrorMessage(updateProfile.error) }]} />
          )}
        </FieldGroup>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </form>
  );
}
