"use client";

import Link from "next/link";
import { IconLink, IconPencil } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { ProfileSummary } from "../types";
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
}: ProfileSummary & { isOwnProfile: boolean }) {
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
        <FollowButton identifier={identifier} isFollowing={isFollowing} />
      )}
      {isOwnProfile && (
        <Button
          variant="outline"
          className="w-full justify-between"
          nativeButton={false}
          render={<Link href="/settings" />}
        >
          프로필 수정
          <IconPencil className="size-4" />
        </Button>
      )}
    </div>
  );
}
