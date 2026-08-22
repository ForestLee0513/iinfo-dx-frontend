import type { BoardComparison, BoardUser } from "@/api/iidxTables/types";

type ComparisonSummaryProps = {
  opponent: BoardUser;
  comparison: BoardComparison;
};

export function ComparisonSummary({ opponent, comparison }: ComparisonSummaryProps) {
  const opponentLabel = opponent.handle
    ? `@${opponent.handle}${opponent.dj_name ? `(${opponent.dj_name})` : ""}`
    : (opponent.dj_name ?? "상대");

  const { win_rate: winRate } = comparison;
  const resultText =
    winRate === null
      ? "아직 비교할 채보가 없습니다."
      : winRate > 50
        ? `당신이 더 우세입니다. (${winRate}% vs ${100 - winRate}%)`
        : winRate < 50
          ? `상대가 더 우세입니다. (${100 - winRate}% vs ${winRate}%)`
          : "막상막하입니다. (50% vs 50%)";

  return (
    <p className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{opponentLabel}</span> 님과
      비교중
      <br />
      {resultText}
    </p>
  );
}
