import { redirect } from "next/navigation";

// /settings 자체는 콘텐츠가 없다 — 기본 탭(계정)으로 보낸다.
export default function SettingsPage() {
  redirect("/settings/account");
}
