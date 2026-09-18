import type { ReactNode } from "react";

import type { SocialLink } from "@/api/profile/types";

export type ProfileSummary = {
  identifier: string;
  handle: string | null;
  nickname: string | null;
  socialLinks: SocialLink[];
  profileImageUrl: string | null;
  isFollowing: boolean | null;
  followersCount: number;
  followingCount: number;
};

export type ProfileLayoutContext = {
  identifier: string;
  isOwnProfile: boolean;
};

export type ProfileLayoutProps = {
  identifier: string;
  children: (context: ProfileLayoutContext) => ReactNode;
};
