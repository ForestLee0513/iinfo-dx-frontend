"use client";

import Link from "next/link";
import {
  IconArrowsExchange,
  IconHistory,
  IconLink,
  IconPencil,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useIidxProfileQuery } from "@/api/profile/queries";
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
  // IIDX 식별 정보는 프로필 소개와 같은 블록에 둔다. IIDX 탭도 같은 쿼리를
  // 사용하므로 TanStack Query 캐시를 공유해 중복 네트워크 요청은 발생하지 않는다.
  const iidxProfile = useIidxProfileQuery(identifier);
  const initial = (handle ?? nickname ?? "?")
    .replace(/^@/, "")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center xl:flex-col! xl:items-start">
        <Avatar className="size-24 shrink-0 sm:size-32 xl:size-56">
          {profileImageUrl && (
            <AvatarImage
              src={profileImageUrl}
              alt={nickname ?? handle ?? "프로필 이미지"}
            />
          )}
          <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold sm:text-xl xl:text-2xl">
            {nickname ?? (handle ? `@${handle}` : "닉네임 미설정")}
          </h2>
          {handle && (
            <p className="text-sm text-muted-foreground">@{handle}</p>
          )}
          {iidxProfile.isSuccess && (
            <p className="text-sm text-muted-foreground">
              DJ NAME: {" "}
              {iidxProfile.data.dj_name
                ? iidxProfile.data.dj_id
                  ? `${iidxProfile.data.dj_name} (${iidxProfile.data.dj_id})`
                  : iidxProfile.data.dj_name
                : "미등록"}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/profile/${identifier}/followers`}
              className="hover:text-foreground"
            >
              <span className="font-semibold text-foreground">
                {followersCount}
              </span>{" "}
              팔로워
            </Link>
            <Link
              href={`/profile/${identifier}/following`}
              className="hover:text-foreground"
            >
              <span className="font-semibold text-foreground">
                {followingCount}
              </span>{" "}
              팔로잉
            </Link>
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
