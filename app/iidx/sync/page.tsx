import { AuthGuard } from "@/components/common/AuthGuard";
import { ProfileGuard } from "@/components/common/ProfileGuard";
import { SyncGuide } from "@/components/screens/SyncGuide";

// IIDX 성적 갱신은 본인 계정의 서비스 데이터를 업로드하므로 로그인·프로필이 필요하다.
export default function IidxSyncPage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <SyncGuide />
      </ProfileGuard>
    </AuthGuard>
  );
}
