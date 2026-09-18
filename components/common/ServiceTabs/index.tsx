"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ServiceTabsProps = {
  children: ReactNode;
  className?: string;
  iidxHref: string;
};

// 서비스 선택은 로컬 상태가 아닌 URL 전환으로 처리한다. 새 서비스를 지원하면 해당
// 서비스 URL을 탭으로 추가한다.
export function ServiceTabs({ children, className, iidxHref }: ServiceTabsProps) {
  return (
    <Tabs value="iidx" className={className}>
      <TabsList className="h-8 rounded-lg p-0.5">
        <TabsTrigger
          value="iidx"
          className="h-7 rounded-lg px-2 py-1"
          nativeButton={false}
          render={<Link href={iidxHref} />}
        >
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
