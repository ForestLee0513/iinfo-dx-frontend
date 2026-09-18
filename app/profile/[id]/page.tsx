import { redirect } from "next/navigation";

// 기존 공용 프로필 주소는 기본 서비스(IIDX)의 프로필 리소스로 보낸다.
export default async function ProfileRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/iidx/profiles/${encodeURIComponent(id)}`);
}
