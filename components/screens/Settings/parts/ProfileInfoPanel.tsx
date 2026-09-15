"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { useUpdateProfileMutation } from "@/api/profile/queries";
import type { SocialLink } from "@/api/profile/types";
import { IidxVisibilityRow } from "./IidxVisibilityRow";

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
        detail.map((item) => item.msg).join(" ") || "정보 변경에 실패했습니다."
      );
    }
    return detail ?? "정보 변경에 실패했습니다.";
  }
  return "정보 변경에 실패했습니다.";
}

type ProfileInfoPanelProps = {
  identifier: string;
  nickname: string | null;
  handle: string | null;
  socialLinks: SocialLink[];
  isPublic: boolean;
  isIidxMember: boolean;
  serviceVisibility: Record<string, boolean>;
};

// 닉네임 변경과 정보 변경(핸들/소셜 링크/공개 여부)은 원래 별도 탭이었지만, 하나의
// 프로필 수정(PATCH /profile/me) 요청으로 묶이는 필드라 폼도 하나로 합쳤다.
export function ProfileInfoPanel({
  identifier,
  nickname,
  handle,
  socialLinks,
  isPublic,
  isIidxMember,
  serviceVisibility,
}: ProfileInfoPanelProps) {
  const [nicknameValue, setNicknameValue] = useState(nickname ?? "");
  const [handleValue, setHandleValue] = useState(handle ?? "");
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const [isPublicValue, setIsPublicValue] = useState(isPublic);
  const [serviceVisibilityValue, setServiceVisibilityValue] =
    useState(serviceVisibility);
  const [socialLinksError, setSocialLinksError] = useState<string | null>(null);
  const updateProfile = useUpdateProfileMutation(identifier);
  const isHandleLocked = handle !== null;

  function updateLink(index: number, patch: Partial<SocialLink>) {
    setSocialLinksError(null);
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    );
  }

  function removeLink(index: number) {
    setSocialLinksError(null);
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function addLink() {
    setLinks((prev) => [...prev, { platform: "", url: "" }]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedNickname = nicknameValue.trim();
    const trimmedHandle = handleValue.trim();
    // 소셜 링크는 플랫폼과 URL을 한 쌍으로 받아야 한다.
    const trimmedLinks = links
      .map((link) => ({ platform: link.platform.trim(), url: link.url.trim() }));

    if (trimmedLinks.some((link) => !link.platform || !link.url)) {
      setSocialLinksError("소셜 링크의 플랫폼과 URL을 모두 입력해주세요.");
      return;
    }

    setSocialLinksError(null);

    updateProfile.mutate(
      {
        nickname: trimmedNickname || null,
        // 핸들은 최초 지정 후 변경할 수 없으므로, 이미 있는 경우에는 요청 본문에도
        // 포함하지 않는다. 아직 없는 계정만 여기서 최초 설정하거나 비워 둘 수 있다.
        ...(isHandleLocked ? {} : { handle: trimmedHandle || null }),
        social_links: trimmedLinks,
        is_public: isPublicValue,
        service_visibility: serviceVisibilityValue,
      },
      { onSuccess: () => toast.success("정보가 변경되었습니다.") },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">정보 변경</p>
      <div className="w-full rounded-lg border border-border p-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="settings-nickname">닉네임 (선택)</FieldLabel>
            <Input
              id="settings-nickname"
              value={nicknameValue}
              onChange={(event) => setNicknameValue(event.target.value)}
              placeholder="예: 홍길동"
              maxLength={30}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="settings-handle">핸들</FieldLabel>
            <Input
              id="settings-handle"
              value={handleValue}
              onChange={(event) => setHandleValue(event.target.value)}
              placeholder="예: username"
              maxLength={30}
              disabled={isHandleLocked}
            />
            {isHandleLocked && (
              <FieldDescription>
                핸들은 최초 설정 후 변경할 수 없습니다.
              </FieldDescription>
            )}
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
            {socialLinksError && (
              <FieldError errors={[{ message: socialLinksError }]} />
            )}
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>프로필 공개</FieldTitle>
              <FieldDescription>
                비공개로 전환하면 다른 사용자에게 프로필이 보이지 않습니다.
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={isPublicValue}
              onCheckedChange={setIsPublicValue}
              aria-label="프로필 공개 여부"
            />
          </Field>

          <Field>
            <FieldLabel>서비스별 공개 여부</FieldLabel>
            {!isPublicValue && (
              <FieldDescription>
                전체 프로필을 비활성화 할 경우 하위 모든 서비스가 비공개
                처리됩니다.
              </FieldDescription>
            )}
            <FieldContent>
              <IidxVisibilityRow
                isMember={isIidxMember}
                disabled={!isPublicValue}
                checked={serviceVisibilityValue.iidx ?? true}
                onCheckedChange={(checked) =>
                  setServiceVisibilityValue((prev) => ({
                    ...prev,
                    iidx: checked,
                  }))
                }
              />
            </FieldContent>
          </Field>

          {updateProfile.isError && (
            <FieldError
              errors={[{ message: getErrorMessage(updateProfile.error) }]}
            />
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
