import { IidxProfileOverview } from "@/components/screens/Profile/iidx";

// IIDX 서비스 프로필. user_id는 백엔드 프로필 API의 식별자와 대응한다.
export default async function IidxProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IidxProfileOverview identifier={id} />;
}
