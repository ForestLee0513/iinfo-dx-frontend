"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useSettingsProfile } from "../hooks/useSettingsProfile";
import { AccountPanel } from "./AccountPanel";

export function AccountSettings() {
  const { identifier, profile, isPending } = useSettingsProfile();

  if (isPending || !identifier) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <AccountPanel
      identifier={identifier}
      isIidxMember={profile?.joined_services.includes("iidx") ?? false}
    />
  );
}
