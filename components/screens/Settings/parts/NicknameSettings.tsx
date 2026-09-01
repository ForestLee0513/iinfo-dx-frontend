"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useSettingsProfile } from "../hooks/useSettingsProfile";
import { NicknamePanel } from "./NicknamePanel";

export function NicknameSettings() {
  const { identifier, profile, isPending } = useSettingsProfile();

  if (isPending || !identifier) {
    return <Skeleton className="h-48 w-full" />;
  }

  return <NicknamePanel identifier={identifier} nickname={profile?.nickname ?? null} />;
}
