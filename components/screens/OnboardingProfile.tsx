"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { IconInfoCircle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";
import { useUpdateProfileMutation } from "@/api/profile/queries";

type HandleUpdateErrorDetail =
  | string
  | { type: string; loc: (string | number)[]; msg: string }[];

const HANDLE_PATTERN = /^[a-z0-9_.]+$/;
const BLOCKED_HANDLE_SUBSTRINGS = ["@", "#", ":", "`"];

function getHandleValidationMessage(handle: string): string | null {
  if (!handle) return "핸들을 입력해 주세요.";
  if (BLOCKED_HANDLE_SUBSTRINGS.some((term) => handle.includes(term))) {
    return "핸들에는 @, #, :, 백틱(`), everyone, here, discord를 사용할 수 없습니다.";
  }
  if (handle.includes("..")) {
    return "마침표(.)는 연속해서 사용할 수 없습니다.";
  }
  if (!HANDLE_PATTERN.test(handle)) {
    return "핸들은 소문자 영문, 숫자, 밑줄(_), 마침표(.)만 사용할 수 있습니다.";
  }
  return null;
}

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

// 신규 계정(핸들 미등록) 전용 랜딩 — 공용 프로필(/profile/[id])의 사이드바에 있던
// "핸들 등록" 다이얼로그를 페이지 단위로 확장한 형태다. 핸들은 서비스 이용에 필수라
// 건너뛰기를 제공하지 않고, 대신 로그아웃으로 빠져나갈 수 있게 한다.
//
// 이 컴포넌트는 <AuthGuard>로 감싸진 라우트에서만 렌더되므로 myInfo는 사실상 항상
// 채워져 있다 — identifier가 비어있는 순간은 그 사이의 짧은 리렌더뿐이라 스켈레톤으로 넘긴다.
export function OnboardingProfile() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [nickname, setNickname] = useState("");
  const [handleError, setHandleError] = useState<string | null>(null);
  const myInfo = useMyInfoQuery();
  const identifier = myInfo.data?.id;
  const updateProfile = useUpdateProfileMutation(identifier ?? "");
  const logout = useLogoutMutation();
  const displayedHandleError =
    handleError ??
    (updateProfile.isError ? getErrorMessage(updateProfile.error) : null);

  if (!identifier) {
    return <Skeleton className="h-114 w-full max-w-sm" />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationMessage = getHandleValidationMessage(handle);
    if (validationMessage) {
      setHandleError(validationMessage);
      return;
    }

    updateProfile.mutate(
      { handle, nickname: nickname.trim() || null },
      {
        onSuccess: (data) => {
          router.push(`/profile/${data.handle ?? data.id}`);
        },
      },
    );
  }

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => router.replace("/"),
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">프로필을 완성해주세요</CardTitle>
        <CardDescription>
          서비스를 이용하려면 핸들과 닉네임을 설정해야 합니다.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="onboarding-handle">핸들</FieldLabel>
              <Input
                id="onboarding-handle"
                value={handle}
                onChange={(event) => {
                  setHandle(event.target.value);
                  setHandleError(null);
                  updateProfile.reset();
                }}
                placeholder="예: iinfo_dx"
                maxLength={30}
                aria-invalid={displayedHandleError ? true : undefined}
                required
              />
              <FieldDescription>
                소문자 영문, 숫자, 밑줄(_), 마침표(.) 사용 가능 · 최대 30자
              </FieldDescription>
              {displayedHandleError && (
                <FieldError errors={[{ message: displayedHandleError }]} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="onboarding-nickname">
                닉네임 (선택)
              </FieldLabel>
              <Input
                id="onboarding-nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="예: 홍길동"
                maxLength={30}
              />
              <FieldDescription>
                다른 사용자에게 표시되는 이름입니다.
              </FieldDescription>
            </Field>

            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <IconInfoCircle className="mt-0.5 size-4 shrink-0" />
              <p>
                핸들이란? 프로필 URL(/profile/핸들)로 공유되고, 검색·팔로우·
                라이벌 등록에 쓰이는 나만의 고유 식별자입니다.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={updateProfile.isPending || !handle}
            >
              {updateProfile.isPending ? "저장 중..." : "프로필 완성하기"}
            </Button>
          </FieldGroup>
        </form>

        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-2 w-full"
          disabled={logout.isPending}
          onClick={handleLogout}
        >
          {logout.isPending ? "로그아웃 중..." : "로그아웃"}
        </Button>
      </CardContent>
    </Card>
  );
}
