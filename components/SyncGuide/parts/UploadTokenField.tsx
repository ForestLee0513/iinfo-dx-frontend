"use client";

import { Button, Input, Label } from "@forestlee0513/iinfo-dx-design-system";

import { useCreateUploadTokenMutation } from "@/api/iidxScores/queries";

interface UploadTokenFieldProps {
  idPrefix: string;
}

export function UploadTokenField({ idPrefix }: UploadTokenFieldProps) {
  const { mutate, data, isPending } = useCreateUploadTokenMutation();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${idPrefix}-upload-token`}>업로드 토큰</Label>
      <div className="flex flex-col gap-2">
        <Input
          id={`${idPrefix}-upload-token`}
          readOnly
          value={data?.token ?? ""}
          placeholder="발급하기 버튼을 눌러 토큰을 발급받으세요."
          className="font-mono text-sm"
        />
        <Button onClick={() => mutate()} disabled={isPending}>
          {isPending ? "발급 중..." : "발급하기"}
        </Button>
      </div>
      {data && (
        <p className="text-xs text-muted-foreground">
          유효 시간: {Math.floor(data.expires_in / 60)}분
        </p>
      )}
    </div>
  );
}
