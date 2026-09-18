"use client";

import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ServiceTabsProps = {
  children: ReactNode;
  className?: string;
};

// 서비스 전용 화면의 공통 진입점. 새 서비스를 지원하면 해당 탭과 콘텐츠를 추가한다.
export function ServiceTabs({ children, className }: ServiceTabsProps) {
  return (
    <Tabs defaultValue="iidx" className={className}>
      <TabsList className="h-8 rounded-lg p-0.5">
        <TabsTrigger value="iidx" className="h-7 rounded-lg px-2 py-1">
          IIDX
        </TabsTrigger>
        <TabsTrigger value="sdvx" disabled className="h-7 rounded-lg px-2 py-1">
          SDVX(추가 예정)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="iidx" className="mt-10">
        {children}
      </TabsContent>
    </Tabs>
  );
}
