import { AuthGuard } from "@/components/common/AuthGuard";
import { ProfileGuard } from "@/components/common/ProfileGuard";
import { SnapshotRestore } from "@/components/screens/SnapshotRestore";

// IIDX 업로드 스냅샷은 본인만 복구할 수 있다.
export default function IidxRestorePage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <SnapshotRestore />
      </ProfileGuard>
    </AuthGuard>
  );
}
