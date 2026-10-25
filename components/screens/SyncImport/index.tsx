"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";

import { uploadImportedScores } from "@/api/iidxScores/requests";
import type {
  ScoreImportPayload,
  ScoreImportResponse,
} from "@/api/iidxScores/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ImportState =
  | { status: "loading" }
  | { status: "uploading" }
  | { status: "success"; response: ScoreImportResponse }
  | { status: "error"; message: string };

function openImportStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("iinfo-dx-score-import", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("uploads");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingPayload(): Promise<ScoreImportPayload | null> {
  const db = await openImportStore();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("uploads", "readonly")
        .objectStore("uploads").get("pending");
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

async function clearPendingPayload(): Promise<void> {
  const db = await openImportStore();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("uploads", "readwrite");
      tx.objectStore("uploads").delete("pending");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export function SyncImport() {
  const [state, setState] = useState<ImportState>({ status: "loading" });
  const started = useRef(false);

  const upload = useCallback(async () => {
    setState({ status: "uploading" });
    try {
      const payload = await getPendingPayload();
      if (!payload?.csv || (!payload.csv.SP && !payload.csv.DP)) {
        setState({
          status: "error",
          message: "전송된 성적 데이터가 없습니다. 북마크릿을 다시 실행해 주세요.",
        });
        return;
      }
      const response = await uploadImportedScores(payload);
      await clearPendingPayload();
      setState({ status: "success", response });
    } catch (error) {
      const detail = isAxiosError(error)
        ? error.response?.data?.detail
        : null;
      setState({
        status: "error",
        message: typeof detail === "string"
          ? detail
          : "업로드에 실패했습니다. 다시 시도해 주세요.",
      });
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void upload();
  }, [upload]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold">성적 갱신</h1>
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          {state.status === "loading" || state.status === "uploading" ? (
            <p role="status">수집한 성적을 업로드하는 중입니다…</p>
          ) : state.status === "error" ? (
            <>
              <p role="alert">{state.message}</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void upload()}>다시 시도</Button>
                <Button variant="outline" nativeButton={false} render={<Link href="/iidx/score-updates" />}>
                  갱신 안내로 이동
                </Button>
              </div>
            </>
          ) : (
            <>
              <p role="status">성적 갱신이 완료됐습니다.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {state.response.results.map((result) => (
                  <li key={result.play_style}>
                    {result.play_style}: {result.song_count}곡
                    {result.changed ? " 갱신" : " · 이전과 동일"}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button nativeButton={false} render={<Link href="/iidx/tables" />}>
                  서열표로 이동
                </Button>
                <Button variant="outline" nativeButton={false} render={<Link href="/iidx/score-snapshots" />}>
                  갱신 기록 보기
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
