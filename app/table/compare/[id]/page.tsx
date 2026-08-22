import { RankTable } from "@/components/RankTable";

// id는 비교 대상의 UUID 또는 handle — useProfileQuery(identifier)와 그대로 대응한다.
// 비로그인이면 비교 자체가 성립하지 않아 RankTable이 곡 리스트만 있는 미리보기로 대체한다.
export default async function TableComparePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RankTable opponent={{ identifier: id }} />;
}
