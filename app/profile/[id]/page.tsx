import { redirect } from "next/navigation";

// 기존 공용 프로필 주소는 기본 서비스(IIDX) 탭으로 보낸다. 서비스 선택은 URL이
// 기준이므로 공유·새로고침 시에도 선택한 서비스가 유지된다.
export default async function ProfileRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/profile/${encodeURIComponent(id)}/iidx`);
}
