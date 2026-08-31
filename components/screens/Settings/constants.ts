import type { SettingsTabDefinition } from "./types";

// 닉네임 변경/정보 변경은 아직 대응하는 화면 디자인이 없어 준비 중 패널로 표시한다.
export const SETTINGS_TABS: SettingsTabDefinition[] = [
  { id: "nickname", label: "닉네임 변경" },
  { id: "profile", label: "정보 변경" },
  { id: "account", label: "계정" },
];
