import { AuthGuard } from "@/components/common/AuthGuard";
import { RankTable } from "@/components/common/RankTable";

// id는 IIDX 서열표 비교 대상의 UUID 또는 handle이다. 비교 기능은 IIDX 성적을
// 사용하므로 IIDX 서비스 경로 아래에 둔다.
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
