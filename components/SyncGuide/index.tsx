"use client";

import Link from "next/link";
import { IconCopy, IconHistory } from "@tabler/icons-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  buttonVariants,
} from "@forestlee0513/iinfo-dx-design-system";

import { UploadTokenField } from "./parts/UploadTokenField";

const BOOKMARKLET_SCRIPT = `javascript:(function(d){var s=d.createElement("script");s.src="https://forestlee0513.github.io/iinfo-dx-crawler/iidx-crawler.js?v="+Math.floor(Date.now()/1e5);d.body.append(s)})(document);`;

export function SyncGuide() {
  const handleCopy = () => {
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
        <Link
          href="/restore"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <IconHistory className="size-4" />
          복구하기
        </Link>
      </div>

      <Tabs defaultValue="pc" className="mt-4">
        <TabsList variant="line">
          <TabsTrigger value="pc">PC</TabsTrigger>
          <TabsTrigger value="mobile">모바일</TabsTrigger>
        </TabsList>

        {/* PC 탭 */}
        <TabsContent value="pc" className="mt-4 flex flex-col gap-4">
          <Alert className="border-amber-500/30 bg-amber-500/10">
            <AlertDescription className="text-base leading-6 text-muted-foreground">
              <p>
                해당 기능을 이용하기 위해서 e-Amusement의 계정에 베이직 코스에
                가입되어 있어야 이용 가능하며, 프리미엄 코스 가입을 권장
                드립니다.
              </p>
            </AlertDescription>
          </Alert>

          <UploadTokenField idPrefix="pc" />

          <div className="flex flex-col gap-2">
            <ol className="list-decimal text-sm text-foreground">
              <li className="ms-5">
                아래 URL을 드래그 해서 복사하거나{" "}
                <IconCopy
                  className="mb-px inline size-[0.625rem] align-middle"
                  aria-hidden
                />{" "}
                아이콘을 눌러 복사 후 북마크에 저장하세요.
              </li>
            </ol>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <code className="min-w-0 flex-1 break-all font-mono text-sm text-muted-foreground">
                  {BOOKMARKLET_SCRIPT}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
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
              e-Amusement에 로그인 후 저장했던 북마크를 클릭해 스크립트를
              실행하세요.
            </li>
            <li className="ms-5">
              실행된 스크립트의 안내에 따라 갱신을 완료하세요.
            </li>
          </ol>
        </TabsContent>

        {/* 모바일 탭 */}
        <TabsContent value="mobile" className="mt-4 flex flex-col gap-4">
          <Alert className="border-amber-500/30 bg-amber-500/10">
            <AlertDescription className="text-base leading-6 text-muted-foreground">
              <p>
                해당 기능을 이용하기 위해서 e-Amusement의 계정에 베이직 코스에
                가입되어 있어야 이용 가능하며, 프리미엄 코스 가입을 권장
                드립니다.
              </p>
            </AlertDescription>
          </Alert>

          <UploadTokenField idPrefix="mobile" />

          <div className="flex flex-col gap-2">
            <ol className="list-decimal text-sm text-foreground">
              <li className="ms-5">
                아래{" "}
                <IconCopy
                  className="mb-px inline size-[0.625rem] align-middle"
                  aria-hidden
                />{" "}
                아이콘을 터치해 복사 후 북마크에 저장하세요.
              </li>
            </ol>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <code className="min-w-0 flex-1 break-all font-mono text-sm text-muted-foreground">
                  {BOOKMARKLET_SCRIPT}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
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
              e-Amusement에 로그인 후 저장했던 북마크를 터치해 스크립트를
              실행하세요.
            </li>
            <li className="ms-5">
              실행된 스크립트의 안내에 따라 갱신을 완료하세요.
            </li>
          </ol>
        </TabsContent>
      </Tabs>
    </main>
  );
}
