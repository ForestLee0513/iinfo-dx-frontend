import Link from "next/link";
import {
  IconArrowsExchange,
  IconHistory,
  IconLink,
  IconPencil,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { OwnProfileSectionProps, ProfileSummary } from "../types";
import { FollowButton } from "./FollowButton";

export function ProfileIdentity({
  identifier,
  handle,
  nickname,
  socialLinks,
  profileImageUrl,
  isFollowing,
  followersCount,
  followingCount,
  isOwnProfile,
}: ProfileSummary & OwnProfileSectionProps) {
  const initial = (handle ?? nickname ?? "?")
    .replace(/^@/, "")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center xl:flex-col! xl:items-start">
        <Avatar className="size-32 shrink-0 sm:size-28 md:size-36 xl:size-56">
          {profileImageUrl && (
            <AvatarImage
              src={profileImageUrl}
              alt={nickname ?? handle ?? "프로필 이미지"}
            />
          )}
          <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {nickname ?? (handle ? `@${handle}` : "닉네임 미설정")}
          </h2>
          {handle && (
            <p className="text-sm text-muted-foreground">@{handle}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {followersCount}
              </span>{" "}
              팔로워
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {followingCount}
              </span>{" "}
              팔로잉
            </span>
          </div>
          <div className="space-y-0.5 text-sm text-muted-foreground">
            {socialLinks.map((link) => (
              <p
                key={`${link.platform}-${link.url}`}
                className="flex items-center gap-1"
              >
                <IconLink className="size-3.5 shrink-0" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {link.platform}
                </a>
              </p>
            ))}
          </div>
        </div>
      </div>
      {isOwnProfile === false && (
        <>
          <FollowButton identifier={identifier} isFollowing={isFollowing} />
          <Button
            variant="outline"
            className="w-full justify-between"
            nativeButton={false}
            render={<Link href={`/table/compare/${identifier}`} />}
          >
            서열표 비교하기
            <IconArrowsExchange className="size-4" />
          </Button>
        </>
      )}
      {isOwnProfile && (
        <>
          {/* 프로필 수정 폼은 /settings(정보 변경/닉네임 변경 탭)로 이동했다 */}
          <Button
            variant="outline"
            className="w-full justify-between"
            nativeButton={false}
            render={<Link href="/settings" />}
          >
            프로필 수정
            <IconPencil className="size-4" />
          </Button>
          {/* 본인 프로필에서만 노출 — 지난 성적 스냅샷으로 복구하는 페이지로 이동 */}
          <Button
            variant="outline"
            className="w-full justify-between"
            nativeButton={false}
            render={<Link href="/restore" />}
          >
            복구하기
            <IconHistory className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}
