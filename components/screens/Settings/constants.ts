import type { SettingsTabDefinition } from "./types";

export const SETTINGS_TABS: SettingsTabDefinition[] = [
  { id: "nickname", label: "닉네임 변경", href: "/settings/nickname" },
  { id: "profile", label: "정보 변경", href: "/settings/profile" },
  { id: "account", label: "계정", href: "/settings/account" },
];
