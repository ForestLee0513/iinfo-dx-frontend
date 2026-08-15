"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  cn,
} from "@forestlee0513/iinfo-dx-design-system";

import { IIDX_PLAY_STYLE } from "@/api/iidxScores/constants";
import { useScoreSummaryQuery } from "@/api/iidxScores/queries";
import type { IidxPlayStyle } from "@/api/iidxScores/types";
import { CLEAR_LAMP_META } from "../constants";

const LEVEL_ALL = "all";

type ClearLampRatioProps = {
  userId: string | undefined;
};

export function ClearLampRatio({ userId }: ClearLampRatioProps) {
  const [style, setStyle] = useState<IidxPlayStyle>(IIDX_PLAY_STYLE.SP);
  const [levelValue, setLevelValue] = useState<string>(LEVEL_ALL);
  const level = levelValue === LEVEL_ALL ? undefined : Number(levelValue);

  const summary = useScoreSummaryQuery({ identifier: userId, style, level });

  // 레벨 드롭다운 선택지는 전체 레벨 합산(level 미지정) 응답의 available_levels로 채운다.
  // summary 쿼리에서 바로 꺼내 쓰면 레벨을 바꿀 때마다 새 쿼리가 로딩되는 동안
  // available_levels도 undefined로 비어 옵션이 "전체" 하나로 줄어들어 버린다.
  const levels = useScoreSummaryQuery({ identifier: userId, style, level: undefined });
  const availableLevels = levels.data?.available_levels ?? [];

  // items를 넘기지 않으면 <SelectValue />가 선택된 항목의 라벨(예: "★5") 대신
  // 저장된 원시 value 문자열("5")을 그대로 렌더링한다 — 트리거에 항상 올바른
  // 한글/기호 라벨이 보이도록 base-ui 권장 방식대로 명시적으로 매핑을 넘긴다.
  const levelItems: Record<string, string> = {
    [LEVEL_ALL]: "전체",
    ...Object.fromEntries(availableLevels.map((lv) => [String(lv), `★${lv}`])),
  };
  const styleItems: Record<string, string> = {
    [IIDX_PLAY_STYLE.SP]: "SP",
    [IIDX_PLAY_STYLE.DP]: "DP",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg sm:text-xl">클리어 램프 비율</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            items={levelItems}
            value={levelValue}
            onValueChange={(value) => setLevelValue(value ?? LEVEL_ALL)}
          >
            <SelectTrigger size="sm" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LEVEL_ALL}>전체</SelectItem>
              {availableLevels.map((lv) => (
                <SelectItem key={lv} value={String(lv)}>
                  {`★${lv}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            items={styleItems}
            value={style}
            onValueChange={(value) => {
              setStyle(value as IidxPlayStyle);
              setLevelValue(LEVEL_ALL);
            }}
          >
            <SelectTrigger size="sm" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={IIDX_PLAY_STYLE.SP}>SP</SelectItem>
              <SelectItem value={IIDX_PLAY_STYLE.DP}>DP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {summary.isPending ? (
          <>
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {CLEAR_LAMP_META.map(({ key }) => (
                <Skeleton key={key} className="h-5 w-full" />
              ))}
            </div>
          </>
        ) : summary.isError ? (
          <p className="text-sm text-muted-foreground">
            클리어 현황을 불러오지 못했습니다.
          </p>
        ) : (
          <>
            <div className="flex h-10 w-full overflow-hidden rounded-md border">
              {CLEAR_LAMP_META.map(({ key, swatchClassName }) => (
                <div
                  key={key}
                  // hard_clear는 흰색 램프라 카드 배경과 구분이 안 돼 세그먼트 사이에
                  // 경계선을 그어준다 — 범례 스와치의 border와 동일한 처리.
                  className={cn(
                    "h-full border-r border-border last:border-r-0",
                    swatchClassName,
                  )}
                  // width(%) 대신 flex-grow 비율로 나눈다 — percentages는 소수 1자리로
                  // 반올림된 값이라 8개를 합쳐도 정확히 100이 안 될 수 있고, 그 오차만큼
                  // 맨 오른쪽에 빈 픽셀이 남는다. flex-grow는 항상 컨테이너 폭을 꽉 채운다.
                  style={{ flexGrow: summary.data.percentages[key], flexBasis: 0 }}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {CLEAR_LAMP_META.map(({ key, label, swatchClassName }) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-4 shrink-0 rounded-sm border",
                      swatchClassName,
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    {label} ({summary.data.percentages[key]}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
