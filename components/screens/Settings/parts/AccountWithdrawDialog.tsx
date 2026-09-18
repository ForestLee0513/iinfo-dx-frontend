"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

import { useWithdrawAccountMutation } from "@/api/auth/queries";

export function AccountWithdrawDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const withdrawAccount = useWithdrawAccountMutation();

  function handleConfirm() {
    withdrawAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success("회원 탈퇴가 완료되었습니다.");
        sessionStorage.removeItem("handle_setup_redirected");
        router.replace("/");
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
          <DialogTitle>회원 탈퇴</DialogTitle>
          <DialogDescription>
            계정과 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>취소</DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={withdrawAccount.isPending}
            onClick={handleConfirm}
          >
            {withdrawAccount.isPending ? "처리 중..." : "탈퇴"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
