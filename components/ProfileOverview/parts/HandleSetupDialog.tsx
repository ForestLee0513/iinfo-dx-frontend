"use client";

import { useState } from "react";
import { isAxiosError } from "axios";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  buttonVariants,
} from "@forestlee0513/iinfo-dx-design-system";

import { useUpdateProfileMutation } from "@/api/profile/queries";

type HandleUpdateErrorDetail =
  | string
  | { type: string; loc: (string | number)[]; msg: string }[];

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ detail?: HandleUpdateErrorDetail }>(error)) {
    if (error.response?.status === 409) return "이미 사용 중인 핸들입니다.";
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg).join(" ") || "저장에 실패했습니다.";
    }
    return detail ?? "저장에 실패했습니다.";
  }
  return "저장에 실패했습니다.";
}

type HandleSetupDialogProps = {
  identifier: string;
  triggerLabel?: string;
};

export function HandleSetupDialog({
  identifier,
  triggerLabel = "핸들 등록하기",
}: HandleSetupDialogProps) {
  const [open, setOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const updateProfile = useUpdateProfileMutation(identifier);

  function handleOpenChange(next: boolean) {
    if (next) {
      setHandle("");
      updateProfile.reset();
    }
    setOpen(next);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = handle.trim();
    if (!trimmed) return;
    updateProfile.mutate(
      { handle: trimmed },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants()}>{triggerLabel}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>핸들 등록</DialogTitle>
            <DialogDescription>
              서비스에서 나를 나타낼 고유한 핸들을 입력하세요.
              영문, 숫자, 밑줄(_)을 사용할 수 있으며 최대 30자입니다.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="handle-setup-input">핸들</FieldLabel>
              <Input
                id="handle-setup-input"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="예: forestlee0513"
                maxLength={30}
                required
              />
            </Field>

            {updateProfile.isError && (
              <FieldError
                errors={[{ message: getErrorMessage(updateProfile.error) }]}
              />
            )}
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              나중에
            </DialogClose>
            <Button
              type="submit"
              disabled={updateProfile.isPending || !handle.trim()}
            >
              {updateProfile.isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
