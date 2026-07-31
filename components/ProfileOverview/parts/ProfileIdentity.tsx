import { IconLink } from "@tabler/icons-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@forestlee0513/iinfo-dx-design-system";

import type { OwnProfileSectionProps, ProfileSummary } from "../types";
import { FollowButton } from "./FollowButton";
import { ProfileEditDialog } from "./ProfileEditDialog";

export function ProfileIdentity({
  identifier,
  handle,
  djName,
  djId,
  socialLinks,
  profileImageUrl,
  isFollowing,
  followersCount,
  followingCount,
  isOwnProfile,
}: ProfileSummary & OwnProfileSectionProps) {
  const initial = (handle ?? djName ?? "?")
    .replace(/^@/, "")
    .charAt(0)
    .toUpperCase();
  const djLabel = djName ? (djId ? `${djName} (${djId})` : djName) : "미등록";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center xl:flex-col! xl:items-start">
        <Avatar className="size-32 shrink-0 sm:size-28 md:size-36 xl:size-56">
          {profileImageUrl && (
            <AvatarImage
              src={profileImageUrl}
              alt={handle ?? "프로필 이미지"}
            />
          )}
          <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {handle ? `@${handle}` : "핸들 미설정"}
          </h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{followersCount}</span> 팔로워
            </span>
            <span>
              <span className="font-semibold text-foreground">{followingCount}</span> 팔로잉
            </span>
          </div>
          <div className="space-y-0.5 text-sm text-muted-foreground">
            <p>DJ NAME: {djLabel}</p>
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
        <ProfileEditDialog
          identifier={identifier}
          handle={handle}
          socialLinks={socialLinks}
        />
      )}
    </div>
  );
}
