import { AuthGuard } from "@/components/common/AuthGuard";
import { OnboardingProfile } from "@/components/screens/OnboardingProfile";

// 핸들 미등록 신규 계정을 위한 랜딩 — 로그인은 되어 있어야 하므로 AuthGuard로 감싼다.
export default function OnboardingPage() {
  return (
    <AuthGuard>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <OnboardingProfile />
      </main>
    </AuthGuard>
  );
}
