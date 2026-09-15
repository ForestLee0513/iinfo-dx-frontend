import { AuthGuard } from "@/components/common/AuthGuard";
import { ProfileGuard } from "@/components/common/ProfileGuard";
import { SnapshotRestore } from "@/components/screens/SnapshotRestore";

export default function RestorePage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <SnapshotRestore />
      </ProfileGuard>
    </AuthGuard>
  );
}
