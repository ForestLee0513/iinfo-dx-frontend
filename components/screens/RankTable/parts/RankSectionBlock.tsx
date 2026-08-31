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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {section.entries.map((entry) => (
          <RankEntryRow
            key={entry.id}
            entry={entry}
            showLamp={showLamp}
            showComparison={showComparison}
          />
        ))}
      </div>
    </section>
  );
}
