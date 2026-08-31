import { AuthGuard } from "@/components/common/AuthGuard";
import { Settings } from "@/components/screens/Settings";

// 계정 관리(로그아웃/탈퇴)를 다루는 화면이라 로그인 사용자만 접근할 수 있다.
export default function SettingsPage() {
  return (
    <AuthGuard>
      <Settings />
    </AuthGuard>
  );
}
