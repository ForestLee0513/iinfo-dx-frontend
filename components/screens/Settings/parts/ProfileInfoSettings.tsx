"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useSettingsProfile } from "../hooks/useSettingsProfile";
import { ProfileInfoPanel } from "./ProfileInfoPanel";

export function ProfileInfoSettings() {
  const { identifier, profile, isPending } = useSettingsProfile();

  if (isPending || !identifier) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <ProfileInfoPanel
      identifier={identifier}
      handle={profile?.handle ?? null}
      socialLinks={profile?.social_links ?? []}
    />
  );
}
