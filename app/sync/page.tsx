import { AuthGuard } from "@/components/AuthGuard";
import { SyncGuide } from "@/components/SyncGuide";

// 갱신하기는 본인 계정에 성적을 업로드하는 화면이라 로그인 사용자만 접근할 수 있다.
export default function SyncPage() {
  return (
    <AuthGuard>
      <SyncGuide />
    </AuthGuard>
  );
}
