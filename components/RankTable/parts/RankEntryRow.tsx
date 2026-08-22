import { cn } from "@forestlee0513/iinfo-dx-design-system";

import { CLEAR_LAMP_META } from "@/api/iidxScores/constants";
import type { BoardEntry } from "@/api/iidxTables/types";
import { formatPlayedDate } from "../utils";

// 성적 매칭 실패(score=null)도 "플레이 안 함"과 동일하게 취급한다.
const NO_PLAY_LAMP = "no_play";

function getSwatchClassName(clearLamp: string | null | undefined) {
  return CLEAR_LAMP_META.find(({ key }) => key === (clearLamp ?? NO_PLAY_LAMP))
    ?.swatchClassName;
}

type RankEntryRowProps = {
  entry: BoardEntry;
  // 비로그인 미리보기 — 클리어 램프는 개인 성적이라 로그인해야만 보여준다.
  showLamp: boolean;
  showComparison: boolean;
};

export function RankEntryRow({
  entry,
  showLamp,
  showComparison,
}: RankEntryRowProps) {
  const scoreLine = !showLamp
    ? `${entry.difficulty}${entry.level ? ` Lv.${entry.level}` : ""}`
    : `${entry.score?.dj_level ?? "NO PLAY"}${
        entry.score?.ex_score != null ? ` ${entry.score.ex_score}` : ""
      } | 마지막 플레이: ${formatPlayedDate(entry.score?.last_played_at)}`;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-1 overflow-hidden rounded-lg border bg-card text-foreground",
        showLamp ? "p-4 pl-7.5!" : "p-4",
      )}
    >
      {showLamp &&
        (showComparison ? (
          // 비교 모드 — 위 절반은 본인 램프, 아래 절반은 상대 램프.
          <div className="absolute top-0 left-0 flex h-full w-4 flex-col border-r">
            <span
              className={cn("h-1/2 w-full", getSwatchClassName(entry.score?.clear_lamp))}
            />
            <span
              className={cn(
                "h-1/2 w-full",
                getSwatchClassName(entry.opponent_score?.clear_lamp),
              )}
            />
          </div>
        ) : (
          <span
            className={cn(
              "absolute top-0 left-0 h-full w-4 border-r",
              getSwatchClassName(entry.score?.clear_lamp),
            )}
          />
        ))}
      <p className="text-base font-medium">
        {entry.title}
        {entry.series ? ` (${entry.series})` : ""} [{entry.difficulty}]
      </p>
      <p className="text-sm text-muted-foreground">{scoreLine}</p>
    </div>
  );
}
