import { AuthGuard } from "@/components/common/AuthGuard";
import { RankTable } from "@/components/common/RankTable";

// id는 IIDX 서열표 비교 대상의 UUID 또는 handle이다. 비교 결과는 table-comparisons
// 리소스로 제공하며 IIDX 성적을 사용한다.
export default async function IidxTableComparePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AuthGuard>
      <RankTable opponent={{ identifier: id }} />
    </AuthGuard>
  );
}
