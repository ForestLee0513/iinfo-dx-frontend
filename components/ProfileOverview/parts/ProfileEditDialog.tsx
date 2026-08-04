"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

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
import type { SocialLink } from "@/api/profile/types";

// FastAPI 422는 detail이 문자열이 아니라 ValidationError({type, loc, msg, ...}) 배열로 온다 —
// 객체를 그대로 렌더링하면 React가 터지므로 항상 문자열로 정규화해서 반환한다.
type ProfileUpdateErrorDetail =
  | string
  | { type: string; loc: (string | number)[]; msg: string }[];

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ detail?: ProfileUpdateErrorDetail }>(error)) {
    if (error.response?.status === 409) {
      return "이미 사용 중인 핸들입니다.";
    }
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      return (
        detail.map((item) => item.msg).join(" ") ||
        "프로필 수정에 실패했습니다."
      );
    }
    return detail ?? "프로필 수정에 실패했습니다.";
  }
  return "프로필 수정에 실패했습니다.";
}

type ProfileEditDialogProps = {
  identifier: string;
  handle: string | null;
  socialLinks: SocialLink[];
};

export function ProfileEditDialog({
  identifier,
  handle,
  socialLinks,
}: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [handleValue, setHandleValue] = useState(handle ?? "");
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const updateProfile = useUpdateProfileMutation(identifier);

  // 열릴 때마다 최신 프로필 값으로 폼을 다시 채운다 — 이전에 취소한 입력이 남지 않도록.
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setHandleValue(handle ?? "");
      setLinks(socialLinks);
      updateProfile.reset();
    }
    setOpen(nextOpen);
  }

  function updateLink(index: number, patch: Partial<SocialLink>) {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    );
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function addLink() {
    setLinks((prev) => [...prev, { platform: "", url: "" }]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedHandle = handleValue.trim();
    // 플랫폼/URL 중 하나라도 비어 있는 행은 저장하지 않는다.
    const trimmedLinks = links
      .map((link) => ({ platform: link.platform.trim(), url: link.url.trim() }))
      .filter((link) => link.platform && link.url);

    updateProfile.mutate(
      {
        handle: trimmedHandle || null,
        social_links: trimmedLinks,
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          className: "w-full justify-between sm:w-fit xl:w-full",
        })}
      >
        프로필 수정
        <IconPencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>
              핸들과 소셜 링크를 변경할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="min-h-0 max-h-[450px] flex-1 overflow-y-auto py-4 pr-1">
            <Field>
              <FieldLabel htmlFor="profile-edit-handle">핸들</FieldLabel>
              <Input
                id="profile-edit-handle"
                value={handleValue}
                onChange={(event) => setHandleValue(event.target.value)}
                placeholder="예: username"
                maxLength={30}
              />
            </Field>

            <Field>
              <FieldLabel>소셜 링크</FieldLabel>
              <div className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      aria-label="플랫폼"
                      value={link.platform}
                      onChange={(event) =>
                        updateLink(index, { platform: event.target.value })
                      }
                      placeholder="플랫폼 (예: X)"
                      className="w-28 shrink-0"
                      maxLength={30}
                    />
                    <Input
                      aria-label="URL"
                      value={link.url}
                      onChange={(event) =>
                        updateLink(index, { url: event.target.value })
                      }
                      placeholder="https://..."
                      className="flex-1"
                      maxLength={500}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="링크 삭제"
                      onClick={() => removeLink(index)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={addLink}
                >
                  <IconPlus className="size-4" />
                  링크 추가
                </Button>
              </div>
            </Field>

            {updateProfile.isError && (
              <FieldError
                errors={[{ message: getErrorMessage(updateProfile.error) }]}
              />
            )}
          </FieldGroup>

          <DialogFooter className="shrink-0">
            <DialogClose render={<Button type="button" variant="outline" />}>
              취소
            </DialogClose>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
