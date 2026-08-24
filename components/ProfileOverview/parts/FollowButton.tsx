"use client";

import Link from "next/link";
import { IconCheck, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

import { useToggleFollowMutation } from "@/api/profile/queries";

const BUTTON_CLASS_NAME = "w-full justify-between sm:w-fit xl:w-full";

type FollowButtonProps = {
  identifier: string;
  // 로그인 사용자의 팔로우 여부 — 미로그인이면 서버가 null로 내려준다.
  isFollowing: boolean | null;
};

export function FollowButton({ identifier, isFollowing }: FollowButtonProps) {
  const toggleFollow = useToggleFollowMutation(identifier);

  // 비로그인 사용자는 팔로우할 수 없어 로그인 페이지로 안내한다.
  if (isFollowing === null) {
    return (
      <Button
        variant="outline"
        className={BUTTON_CLASS_NAME}
        nativeButton={false}
        render={<Link href="/login" />}
      >
        팔로우
        <IconPlus className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className={BUTTON_CLASS_NAME}
      disabled={toggleFollow.isPending}
      onClick={() => toggleFollow.mutate(!isFollowing)}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
      {isFollowing ? <IconCheck className="size-4" /> : <IconPlus className="size-4" />}
    </Button>
  );
}
