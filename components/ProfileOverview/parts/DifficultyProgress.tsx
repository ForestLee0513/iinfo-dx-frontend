import { Button } from "@forestlee0513/iinfo-dx-design-system";

import { DIFFICULTY_STATS } from "../constants";
import type { OwnProfileSectionProps } from "../types";
import { StatCard } from "./StatCard";

export function DifficultyProgress({ isOwnProfile }: OwnProfileSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold sm:text-xl">
          난이도표(★12 / SP) 진행도
        </h3>
        {!isOwnProfile && (
          <Button variant="link" size="sm" className="px-0">
            비교하기
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DIFFICULTY_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
    </section>
  );
}
