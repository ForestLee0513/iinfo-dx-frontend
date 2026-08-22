import { RankTable } from "@/components/RankTable";

// 클리어 램프(개인 성적)는 로그인해야만 보이고, 비로그인은 곡 리스트만 보이는
// 미리보기로 대체된다 — 판정은 RankTable 내부에서 하므로 여기서 라우트를 막지 않는다.
export default function TablePage() {
  return <RankTable />;
}
