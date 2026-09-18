"use client";

import { cloneElement, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  ReactElement,
  SVGProps,
} from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useScoreUpdateCalendarQuery } from "@/api/iidxScores/queries";
import type { ActivityHeatMapValue } from "../types";

const CURRENT_YEAR = new Date().getFullYear();

// GET /api/v1/iidx/scores/update-calendar가 since/until(YYYY-MM-DD, tz
// 기준)을 직접 받는다 — 선택한 연도의 1/1~12/31을 그대로 넘겨 연도 경계에 정확히
// 맞춘 데이터를 받는다(연도를 바꾸면 쿼리 키가 달라져 새로 조회된다).
function getYearRangeParams(year: number) {
  return {
    since: `${year}-01-01`,
    until: `${year}-12-31`,
  };
}

// 선택한 해의 1월 1일 ~ 12월 31일을 기준점으로 잡는다 — "오늘" 기준 롤링 365일이 아니라
// 캘린더가 쓰는 것과 동일한 연도 경계에 맞춘다.
function getHeatMapDateRangeForYear(year: number) {
  return {
    startDate: new Date(year, 0, 1),
    endDate: new Date(year, 11, 31),
  };
}

// react-calendar-heatmap의 values 항목이 기대하는 "YYYY/MM/DD" 형식으로 맞춘다
// (로컬 자정 기준으로 파싱되게 하기 위해 "-" 대신 "/" 구분자를 쓴다).
function formatLocalDate(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

// 선택한 해의 모든 날짜를 나열한다 — 업로드가 없는 날짜는 응답 목록에 없으므로,
// 해당 날짜도 0건으로 채워 모든 셀에 값이 존재하게 만들어 호버 시 항상
// "날짜 · n건" 형식으로 표시되게 한다.
function getYearDates(year: number) {
  const dates: string[] = [];
  const date = new Date(year, 0, 1);
  while (date.getFullYear() === year) {
    dates.push(formatLocalDate(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
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

type ActivityHeatMapProps = {
  userId: string | undefined;
};

// react-calendar-heatmap의 titleForValue는 브라우저 기본 SVG <title> 툴팁이라
// 노출까지 지연이 있고 스타일을 못 입힌다 — 호버한 셀 위에 고정으로 뜨는 커스텀
// 툴팁으로 대체한다(커서를 따라다니지 않고, 셀의 bounding rect를 기준으로 위치).
type HoveredCell = {
  value: ActivityHeatMapValue;
  x: number;
  y: number;
};

export function ActivityHeatMap({ userId }: ActivityHeatMapProps) {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
  const { startDate, endDate } = getHeatMapDateRangeForYear(year);
  const heatMapContainerRef = useRef<HTMLDivElement>(null);

  const updateCalendar = useScoreUpdateCalendarQuery({
    identifier: userId,
    ...getYearRangeParams(year),
    // 서버가 날짜 경계를 이 타임존(zoneinfo, 서머타임 자동 반영) 기준으로 잡아
    // 날짜별 집계까지 마쳐서 내려준다 — FE는 사용자의 로컬 타임존만 넘기면 된다.
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const availableYears = updateCalendar.data?.available_years ?? [];

  const countByDate = new Map(
    Object.entries(updateCalendar.data?.days ?? {}).map(([date, counts]) => [
      date.replaceAll("-", "/"),
      counts,
    ]),
  );
  const values: ActivityHeatMapValue[] = getYearDates(year).map((date) => {
    const counts = countByDate.get(date);
    return {
      date,
      count: counts?.total ?? 0,
      added: counts?.added ?? 0,
      updated: counts?.updated ?? 0,
    };
  });

  // items를 넘기지 않으면 <SelectValue />가 선택된 항목의 라벨("2026년") 대신
  // 저장된 원시 value 문자열("2026")을 그대로 렌더링한다.
  const yearItems: Record<string, string> = Object.fromEntries(
    // 현재 연도에 이력이 없더라도 선택된 값의 라벨은 유지한다. 실제 드롭다운
    // 항목은 아래 availableYears만 사용하므로 서버가 알려준 범위만 노출된다.
    [...new Set([year, ...availableYears])].map((y) => [String(y), `${y}년`]),
  );

  // 라이브러리가 매 렌더마다 viewBox를 다시 계산해 덮어쓰므로 렌더 이후 매번 보정한다.
  useEffect(() => {
    const svg = heatMapContainerRef.current?.querySelector(
      "svg.react-calendar-heatmap",
    );
    const viewBox = svg instanceof SVGSVGElement ? svg.viewBox.baseVal : null;
    if (viewBox) {
      viewBox.height = CORRECTED_SVG_HEIGHT;
    }
  });

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex justify-end">
        <Select
          items={yearItems}
          value={String(year)}
          onValueChange={(value) => setYear(Number(value ?? CURRENT_YEAR))}
        >
          <SelectTrigger size="sm" className="w-24" disabled={availableYears.length === 0}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {`${y}년`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {updateCalendar.isPending ? (
        <Skeleton className="h-36 w-full" />
      ) : updateCalendar.isError ? (
        <p className="text-sm text-muted-foreground">
          성적 갱신 기여도를 불러오지 못했습니다.
        </p>
      ) : (
        <div
          ref={heatMapContainerRef}
          className="overflow-x-auto rounded-lg border p-3
            [&_svg.react-calendar-heatmap]:min-h-36 [&_svg.react-calendar-heatmap]:w-auto
            [&_rect:hover]:stroke-1 [&_rect:hover]:stroke-foreground
            [&_text]:fill-muted-foreground [&_text]:text-[10px]"
        >
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={values}
            showWeekdayLabels
            weekdayLabels={WEEKDAY_LABELS}
            monthLabels={MONTH_LABELS}
            transformDayElement={(element, value) => {
              // values가 선택한 연도의 모든 날짜를 채워 넘기므로 렌더되는 셀은
              // 항상 매칭되는 값을 가진다.
              const typedValue = value as ActivityHeatMapValue;
              // @types/react-calendar-heatmap는 element를 SVGProps로 잘못 선언하지만
              // 런타임에는 실제 <rect> ReactElement가 넘어온다.
              return cloneElement(
                element as unknown as ReactElement<SVGProps<SVGRectElement>>,
                {
                  style: { fill: getFillColor(typedValue?.count) },
                  onMouseEnter: (event: ReactMouseEvent<SVGRectElement>) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setHoveredCell({
                      value: typedValue,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  },
                  onMouseLeave: () => setHoveredCell(null),
                },
              );
            }}
          />
        </div>
      )}

      {hoveredCell && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+8px)]
            rounded-md border bg-popover px-3 py-2 text-xs whitespace-nowrap text-popover-foreground shadow-sm"
          style={{ left: hoveredCell.x, top: hoveredCell.y }}
        >
          <p className="font-medium">{hoveredCell.value.date}</p>
          <p className="mt-1 text-muted-foreground">
            총 {hoveredCell.value.count}개 채보
          </p>
          <div className="mt-1 flex gap-3">
            <span>신규 {hoveredCell.value.added}</span>
            <span>갱신 {hoveredCell.value.updated}</span>
          </div>
        </div>
      )}
    </div>
  );
}
