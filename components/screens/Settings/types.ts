export type SettingsTabId = "profile" | "account";

export type SettingsTabDefinition = {
  id: SettingsTabId;
  label: string;
  href: string;
};
