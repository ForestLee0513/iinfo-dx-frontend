"use client";

import { useRef, useState } from "react";
import { IconCopy, IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  cn,
} from "@forestlee0513/iinfo-dx-design-system";

const BOOKMARKLET_SCRIPT = `javascript:(function(d){var s=d.createElement("script");s.src="https://forestlee0513.github.io/iinfo-dx-crawler/iidx-crawler.js?v="+Math.floor(Date.now()/1e5);d.body.append(s)})(document);`;

export function SyncGuide() {
  const [csvText, setCsvText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(BOOKMARKLET_SCRIPT);
    toast.success("클립보드에 복사되었습니다.");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    readCsvFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readCsvFile(file);
    e.target.value = "";
  };

  const readCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText((event.target?.result as string) ?? "");
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!csvText.trim()) return;
    const file = new File([csvText], "data.csv", { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", file);
    // TODO: API 요청 연결
  };

  return (
    <main className="flex-1 px-4 pt-10 md:pt-[60px] xl:px-60 2xl:pt-[120px]">
      <h1 className="text-[32px] font-normal leading-[40px] text-foreground xl:text-[42px] xl:font-light xl:leading-[50px]">
        갱신하기
      </h1>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileSelect}
      />

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

          <div className="flex flex-col gap-2">
            <Label htmlFor="csv-input-pc">CSV 데이터</Label>
            <div
              className={cn(
                "relative rounded-md transition-all",
                isDragging && "ring-2 ring-primary ring-offset-2",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Textarea
                id="csv-input-pc"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="CSV의 내용을 붙여넣거나 파일을 여기에 드래그하세요."
                className="min-h-40 resize-y font-mono text-sm max-h-125"
              />
              {isDragging && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-primary/10">
                  <IconUpload className="size-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    파일을 놓으세요
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <IconUpload className="size-4" />
              파일 추가
            </Button>
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={!csvText.trim()}>
                갱신 요청
              </Button>
            </div>
          </div>

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
              실행된 스크립트의 안내를 따라 CSV 파일을 클립보드에 복사 후, 상단
              입력창에 붙여넣기 하세요.
            </li>
            <li className="ms-5">
              붙여넣기 후, 갱신 버튼을 클릭해서 갱신을 완료하세요.
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="csv-input-mobile">CSV 데이터</Label>
            <Textarea
              id="csv-input-mobile"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="CSV의 내용을 붙여넣거나 파일을 선택하세요."
              className="min-h-40 resize-y font-mono text-sm max-h-125"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <IconUpload className="size-4" />
              파일 추가
            </Button>
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={!csvText.trim()}>
                갱신 요청
              </Button>
            </div>
          </div>

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
              실행된 스크립트의 안내를 따라 CSV 파일을 클립보드에 복사 후, 상단
              입력창에 붙여넣기 하세요.
            </li>
            <li className="ms-5">
              붙여넣기 후, 갱신 버튼을 터치해서 갱신을 완료하세요.
            </li>
          </ol>
        </TabsContent>
      </Tabs>
    </main>
  );
}
