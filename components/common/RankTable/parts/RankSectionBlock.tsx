import type { BoardSection } from "@/api/iidxTables/types";
import { RankEntryRow } from "./RankEntryRow";

type RankSectionBlockProps = {
  section: BoardSection;
  showLamp: boolean;
  showComparison: boolean;
};

export function RankSectionBlock({
  section,
  showLamp,
  showComparison,
}: RankSectionBlockProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold sm:text-2xl">{section.title}</h2>
      <div className="overflow-hidden rounded-lg border bg-card text-foreground">
        {/* 반응형 열 수(1/2/4)를 위해 tbody를 grid로 두고, 셀 사이 구분선은 gap-px + bg-border로 그린다.
            display가 바뀌면 테이블 의미가 사라지므로 role을 명시한다. */}
        <table role="table" className="block w-full text-left">
          <tbody
            role="rowgroup"
            className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-4"
          >
            {section.entries.map((entry) => (
              <RankEntryRow
                key={entry.id}
                entry={entry}
                showLamp={showLamp}
                showComparison={showComparison}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
