import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forestlee0513/iinfo-dx-design-system";

import type { TableSummary } from "@/api/iidxTables/types";

type DifficultyTableSelectProps = {
  tables: TableSummary[];
  value: string | undefined;
  onValueChange: (value: string) => void;
};

// Figma 시안은 난이도별 탭이었지만, 다양한 난이도표를 대응하기 위해 드롭다운으로 바꿨다.
export function DifficultyTableSelect({
  tables,
  value,
  onValueChange,
}: DifficultyTableSelectProps) {
  const items = Object.fromEntries(
    tables.map(({ slug, name }) => [slug, name]),
  );

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
    >
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {tables.map(({ slug, name }) => (
          <SelectItem key={slug} value={slug}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
