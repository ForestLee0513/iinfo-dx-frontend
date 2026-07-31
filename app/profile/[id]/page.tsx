import { ProfileOverview } from "@/components/ProfileOverview";

// user_id는 백엔드 GET /api/v1/web/profile/{user_id}와 그대로 대응한다.
// 본인 여부(isOwnProfile)는 ProfileOverview가 해당 API의 is_mine으로 직접 판정한다.
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileOverview userId={id} />;
}
