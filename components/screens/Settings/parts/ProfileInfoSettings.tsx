"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

import { useSettingsProfile } from "../hooks/useSettingsProfile";
import { ProfileInfoPanel } from "./ProfileInfoPanel";

export function ProfileInfoSettings() {
  const router = useRouter();
  const { identifier, profile, isPending } = useSettingsProfile();
  const isProfileIncomplete = !isPending && profile?.handle === null;

  useEffect(() => {
    if (isProfileIncomplete) router.replace("/settings/account");
  }, [isProfileIncomplete, router]);

  if (isPending || !identifier || isProfileIncomplete) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <ProfileInfoPanel
      identifier={identifier}
      nickname={profile?.nickname ?? null}
      handle={profile?.handle ?? null}
      socialLinks={profile?.social_links ?? []}
      isPublic={profile?.is_public ?? true}
      isIidxMember={profile?.joined_services.includes("iidx") ?? false}
      serviceVisibility={profile?.service_visibility ?? {}}
    />
  );
}
