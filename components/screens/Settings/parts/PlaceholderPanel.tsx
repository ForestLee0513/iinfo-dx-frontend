import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

type PlaceholderPanelProps = {
  label: string;
};

// 닉네임 변경/정보 변경 탭은 아직 디자인이 없어 준비 중 상태만 보여준다.
export function PlaceholderPanel({ label }: PlaceholderPanelProps) {
  return (
    <Empty className="border border-dashed border-border">
      <EmptyHeader>
        <EmptyTitle>{label}</EmptyTitle>
        <EmptyDescription>준비 중인 기능입니다.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
