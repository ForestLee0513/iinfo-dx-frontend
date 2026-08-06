"use client";

import { cn } from "@forestlee0513/iinfo-dx-design-system";

import type { FeatureSectionProps } from "./types";

// 데스크탑/태블릿(md 이상)에서는 8칼럼 그리드로 이미지·텍스트가 좌우 교차 배치되고,
// 모바일에서는 이미지가 위, 텍스트가 아래로 쌓인다.
export function FeatureSection({
  title,
  description,
  note,
  imagePosition = "start",
}: FeatureSectionProps) {
  return (
    <section className="mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-8 md:grid-cols-8 md:gap-4 md:px-6 md:py-12 xl:px-12 xl:py-16">
      <div
        aria-hidden
        className={cn(
          "aspect-video w-full rounded-md bg-muted md:col-span-3 md:row-start-1",
          imagePosition === "end" ? "md:col-start-6" : "md:col-start-1",
        )}
      />
      <div
        className={cn(
          "flex flex-col justify-center gap-4 md:col-span-5 md:row-start-1",
          imagePosition === "end" ? "md:col-start-1" : "md:col-start-4",
        )}
      >
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="text-base leading-6 text-muted-foreground">{description}</p>
        {note ? (
          <p className="text-xs leading-4 tracking-[0.32px] text-muted-foreground/80">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
