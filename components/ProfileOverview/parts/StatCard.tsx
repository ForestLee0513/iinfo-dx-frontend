import { Card, CardContent } from "@forestlee0513/iinfo-dx-design-system";

import type { DifficultyStat } from "../types";

export function StatCard({ percentage, label, rank }: DifficultyStat) {
  return (
    <Card className="py-8 text-center">
      <CardContent className="flex flex-col items-center gap-2">
        <span className="text-4xl font-bold">{percentage}%</span>
        <div className="text-sm text-muted-foreground">
          <p>{label}</p>
          <p>{rank}</p>
        </div>
      </CardContent>
    </Card>
  );
}
