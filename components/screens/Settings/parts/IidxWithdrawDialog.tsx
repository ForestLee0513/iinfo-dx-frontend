"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useWithdrawIidxProfileMutation } from "@/api/profile/queries";

type IidxWithdrawDialogProps = {
  identifier: string;
};

export function IidxWithdrawDialog({ identifier }: IidxWithdrawDialogProps) {
  const [open, setOpen] = useState(false);
  const withdrawIidx = useWithdrawIidxProfileMutation(identifier);

  function handleConfirm() {
    withdrawIidx.mutate(undefined, {
      onSuccess: () => {
        toast.success("IIDX 서비스 탈퇴가 완료되었습니다.");
        setOpen(false);
      },
      onError: () => toast.error("탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요."),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" className="w-full sm:w-auto" />}>
        탈퇴
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>IIDX 서비스 탈퇴</DialogTitle>
          <DialogDescription>
            IIDX 서비스 데이터(성적, 온보딩 정보 등)가 모두 삭제됩니다. 계정은 유지되며 이
            작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>취소</DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={withdrawIidx.isPending}
            onClick={handleConfirm}
          >
            {withdrawIidx.isPending ? "처리 중..." : "탈퇴"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
