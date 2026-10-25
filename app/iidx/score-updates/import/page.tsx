import { AuthGuard } from "@/components/common/AuthGuard";
import { ProfileGuard } from "@/components/common/ProfileGuard";
import { SyncImport } from "@/components/screens/SyncImport";

export default function IidxScoreImportPage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <SyncImport />
      </ProfileGuard>
    </AuthGuard>
  );
}
