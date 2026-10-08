import { cn } from "@/lib/utils";

import { CLEAR_LAMP_META } from "@/api/iidxScores/constants";
import type { BoardEntry } from "@/api/iidxTables/types";
import { formatPlayedDate } from "../utils";

// 성적 매칭 실패(score=null)도 "플레이 안 함"과 동일하게 취급한다.
const NO_PLAY_LAMP = "no_play";

function getSwatchClassName(clearLamp: string | null | undefined) {
  return CLEAR_LAMP_META.find(({ key }) => key === (clearLamp ?? NO_PLAY_LAMP))
    ?.swatchClassName;
}

// dj_level(등급)이 없는 경우(FAILED 등급 미부여 등)도 있어 "NO PLAY"로 단정할 수 없다 —
// 실제 clear_lamp 기준 라벨로 대체한다.
function getClearLampLabel(clearLamp: string | null | undefined) {
  return CLEAR_LAMP_META.find(({ key }) => key === (clearLamp ?? NO_PLAY_LAMP))
    ?.label;
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
    : `${entry.score?.dj_level ?? getClearLampLabel(entry.score?.clear_lamp)}${
        entry.score?.ex_score != null ? ` ${entry.score.ex_score}` : ""
      } | 마지막 플레이: ${formatPlayedDate(entry.score?.last_played_at)}`;

  return (
    <tr role="row" className="flex bg-card">
      {showLamp && (
        <td role="cell" className="w-4 shrink-0 border-r p-0">
          {showComparison ? (
            // 비교 모드 — 위 절반은 본인 램프, 아래 절반은 상대 램프.
            <div className="flex h-full min-h-16 w-4 flex-col">
              <span
                className={cn(
                  "h-1/2 w-full flex-1",
                  getSwatchClassName(entry.score?.clear_lamp),
                )}
              />
              <span
                className={cn(
                  "h-1/2 w-full flex-1",
                  getSwatchClassName(entry.opponent_score?.clear_lamp),
                )}
              />
            </div>
          ) : (
            <span
              className={cn(
                "block h-full min-h-16 w-4 border-r",
                getSwatchClassName(entry.score?.clear_lamp),
              )}
            />
          )}
        </td>
      )}
      <td role="cell" className="min-w-0 flex-1 px-4 py-3">
        <p className="text-base font-medium">
          {entry.title}
          {entry.series ? ` (${entry.series})` : ""} [{entry.difficulty}]
        </p>
        <p className="text-sm text-muted-foreground">{scoreLine}</p>
      </td>
    </tr>
  );
}
