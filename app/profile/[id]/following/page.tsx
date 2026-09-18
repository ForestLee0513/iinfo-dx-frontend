import { FollowList } from "@/components/screens/FollowList";

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FollowList identifier={id} type="following" />;
}
