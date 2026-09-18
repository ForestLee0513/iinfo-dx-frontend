import { RankTable } from "@/components/common/RankTable";

// IIDX 전용 서열표. 다른 서비스는 같은 /{service}/tables 구조로 자체 화면을 추가한다.
// 클리어 램프(개인 성적)는 로그인해야만 보이고, 비로그인은 곡 리스트만 보이는
// 미리보기로 대체된다 — 판정은 RankTable 내부에서 하므로 여기서 라우트를 막지 않는다.
export default function IidxTablePage() {
  return <RankTable />;
}
