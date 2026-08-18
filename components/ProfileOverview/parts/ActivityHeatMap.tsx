"use client";

import { cloneElement, useEffect, useRef, useState } from "react";
import type { ReactElement, SVGProps } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forestlee0513/iinfo-dx-design-system";

import { ACTIVITY_HEAT_MAP_VALUE } from "../constants";
import type { ActivityHeatMapValue } from "../types";

const CURRENT_YEAR = new Date().getFullYear();

// 연도별 활동 조회 API가 아직 없어 최근 5개년 고정 목록으로 선택지를 채운다.
const SELECTABLE_YEAR_COUNT = 5;
const SELECTABLE_YEARS = Array.from(
  { length: SELECTABLE_YEAR_COUNT },
  (_, idx) => CURRENT_YEAR - idx,
);

// 선택한 해의 1월 1일 ~ 12월 31일을 기준점으로 잡는다 — "오늘" 기준 롤링 365일이 아니라
// 캘린더가 쓰는 것과 동일한 연도 경계에 맞춘다.
function getHeatMapDateRangeForYear(year: number) {
  return {
    startDate: new Date(year, 0, 1),
    endDate: new Date(year, 11, 31),
  };
}

const WEEKDAY_LABELS: [string, string, string, string, string, string, string] =
  ["", "월", "", "수", "", "금", ""];
const MONTH_LABELS: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

// react-calendar-heatmap@1.10.0의 getHeight()는 horizontal 모드에서도 weekday 라벨
// "컬럼" 너비(getWeekdayLabelSize, 30px)를 높이에 그대로 더해버려 SVG 하단에 그만큼
// 빈 여백이 남는다(실제 콘텐츠는 월 라벨 줄 + 7일 그리드까지만 그려진다). rectSize/
// gutterSize 기본값(10/1) 기준으로 실제 필요한 높이만 계산해 viewBox를 보정한다.
const SQUARE_SIZE = 10;
const GUTTER_SIZE = 1;
const MONTH_LABEL_GUTTER_SIZE = 4;
const WEEK_ROWS_HEIGHT = 7 * (SQUARE_SIZE + GUTTER_SIZE);
const MONTH_LABEL_HEIGHT = SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE - GUTTER_SIZE;
const CORRECTED_SVG_HEIGHT = WEEK_ROWS_HEIGHT + MONTH_LABEL_HEIGHT;

// 활동이 없는 칸부터 가장 활발한 칸까지 디자인 시스템의 primary 토큰을 단계적으로
// 섞어 라이트/다크 테마 전환에도 그대로 맞는 색상을 만든다.
function getFillColor(count: number | undefined) {
  if (!count) return "var(--muted)";
  if (count <= 1)
    return "color-mix(in oklch, var(--primary) 35%, var(--muted))";
  if (count <= 3)
    return "color-mix(in oklch, var(--primary) 60%, var(--muted))";
  if (count <= 5)
    return "color-mix(in oklch, var(--primary) 85%, var(--muted))";
  return "var(--primary)";
}

// 활동 기여도 API가 아직 없어 선택한 연도의 목업 데이터로 히트맵만 먼저 채운다.
export function ActivityHeatMap() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const { startDate, endDate } = getHeatMapDateRangeForYear(year);
  const heatMapContainerRef = useRef<HTMLDivElement>(null);

  // items를 넘기지 않으면 <SelectValue />가 선택된 항목의 라벨("2026년") 대신
  // 저장된 원시 value 문자열("2026")을 그대로 렌더링한다.
  const yearItems: Record<string, string> = Object.fromEntries(
    SELECTABLE_YEARS.map((y) => [String(y), `${y}년`]),
  );

  // 라이브러리가 매 렌더마다 viewBox를 다시 계산해 덮어쓰므로 렌더 이후 매번 보정한다.
  useEffect(() => {
    const svg = heatMapContainerRef.current?.querySelector("svg.react-calendar-heatmap");
    const viewBox = svg instanceof SVGSVGElement ? svg.viewBox.baseVal : null;
    if (viewBox) {
      viewBox.height = CORRECTED_SVG_HEIGHT;
    }
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Select
          items={yearItems}
          value={String(year)}
          onValueChange={(value) => setYear(Number(value ?? CURRENT_YEAR))}
        >
          <SelectTrigger size="sm" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SELECTABLE_YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {`${y}년`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        ref={heatMapContainerRef}
        className="overflow-x-auto rounded-md border p-4
          [&_svg.react-calendar-heatmap]:min-h-36 [&_svg.react-calendar-heatmap]:w-auto
          [&_rect:hover]:stroke-1 [&_rect:hover]:stroke-foreground
          [&_text]:fill-muted-foreground [&_text]:text-[10px]"
      >
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={ACTIVITY_HEAT_MAP_VALUE}
          showWeekdayLabels
          weekdayLabels={WEEKDAY_LABELS}
          monthLabels={MONTH_LABELS}
          titleForValue={(value) =>
            value ? `${value.date} · ${value.count}건` : "활동 없음"
          }
          transformDayElement={(element, value) =>
            // @types/react-calendar-heatmap는 element를 SVGProps로 잘못 선언하지만
            // 런타임에는 실제 <rect> ReactElement가 넘어온다.
            cloneElement(
              element as unknown as ReactElement<SVGProps<SVGRectElement>>,
              {
                style: {
                  fill: getFillColor(
                    (value as ActivityHeatMapValue | undefined)?.count,
                  ),
                },
              },
            )
          }
        />
      </div>
    </div>
  );
}
