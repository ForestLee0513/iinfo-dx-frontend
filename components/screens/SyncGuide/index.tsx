"use client";

import Link from "next/link";
import { IconCopy, IconHistory } from "@tabler/icons-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ServiceTabs } from "@/components/common/ServiceTabs";

const crawlerScriptUrl = process.env.NEXT_PUBLIC_CRAWLER_SCRIPT_URL?.trim();
const BOOKMARKLET_SCRIPT = crawlerScriptUrl
  ? `javascript:(function(d){var s=d.createElement("script");s.src=${JSON.stringify(crawlerScriptUrl)}+"?v="+Math.floor(Date.now()/1e5);d.body.append(s)})(document);`
  : null;

export function SyncGuide() {
  const handleCopy = () => {
    if (!BOOKMARKLET_SCRIPT) return;
    navigator.clipboard.writeText(BOOKMARKLET_SCRIPT);
    toast.success("클립보드에 복사되었습니다.");
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-6 xl:px-12! xl:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          갱신하기
        </h1>
        {/* 지난 성적 스냅샷으로 복구하는 페이지로 이동 */}
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/iidx/score-snapshots" />}
        >
          <IconHistory className="size-4" />
          복구하기
        </Button>
      </div>

      <ServiceTabs iidxHref="/iidx/score-updates" className="mt-6">
        <div className="flex flex-col gap-4">
          <Alert className="border-amber-500/30 bg-amber-500/10">
            <AlertDescription className="text-base leading-6 text-muted-foreground">
              <p>
                해당 기능을 이용하기 위해서 e-Amusement의 계정에 베이직 코스에
                가입되어 있어야 이용 가능하며, 프리미엄 코스 가입을 권장
                드립니다.
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <ol className="list-decimal text-sm text-foreground">
              <li className="ms-5">
                아래 스크립트를 복사해 사용 중인 브라우저의 북마크에 저장하세요.
                복사 버튼을 눌러 바로 복사할 수도 있습니다.
              </li>
            </ol>
            {!BOOKMARKLET_SCRIPT && (
              <Alert>
                <AlertDescription>
                  갱신 스크립트가 설정되지 않았습니다. 관리자에게 문의해 주세요.
                </AlertDescription>
              </Alert>
            )}
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <code className="min-w-0 flex-1 break-all font-mono text-sm text-muted-foreground">
                  {BOOKMARKLET_SCRIPT ?? "스크립트를 사용할 수 없습니다."}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!BOOKMARKLET_SCRIPT}
                  aria-label="스크립트 복사"
                  className="shrink-0"
                >
                  <IconCopy className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <ol
            className="list-decimal pb-10 text-sm text-foreground [&>li+li]:mt-4"
            start={2}
          >
            <li className="ms-5">
              e-Amusement에 로그인한 뒤 저장한 북마크를 실행하세요.
            </li>
            <li className="ms-5">
              실행된 스크립트의 안내에 따라 갱신하세요. 수집이 끝나면
              IInfoDX로 이동해 로그인 상태에서 업로드합니다.
            </li>
          </ol>
        </div>
      </ServiceTabs>
    </main>
  );
}
