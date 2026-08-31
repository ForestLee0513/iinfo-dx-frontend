"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useLogoutMutation } from "@/api/auth/queries";
import { AccountActionRow } from "./AccountActionRow";
import { AccountWithdrawDialog } from "./AccountWithdrawDialog";
import { IidxWithdrawDialog } from "./IidxWithdrawDialog";

type AccountPanelProps = {
  identifier: string;
  isIidxMember: boolean;
};

export function AccountPanel({ identifier, isIidxMember }: AccountPanelProps) {
  const router = useRouter();
  const logout = useLogoutMutation();

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">계정</p>
      <div className="w-full rounded-lg border border-border">
        <AccountActionRow
          title="로그아웃"
          description="이 기기에서 로그아웃합니다."
          action={
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              disabled={logout.isPending}
              onClick={() =>
                logout.mutate(undefined, {
                  onSuccess: () => {
                    sessionStorage.removeItem("handle_setup_redirected");
                    router.replace("/");
                  },
                })
              }
            >
              {logout.isPending ? "로그아웃 중..." : "로그아웃"}
            </Button>
          }
        />
        {isIidxMember && (
          <AccountActionRow
            title="IIDX 서비스 탈퇴"
            description="IIDX 서비스 데이터만 삭제됩니다. 계정은 유지됩니다."
            action={<IidxWithdrawDialog identifier={identifier} />}
          />
        )}
        <AccountActionRow
          title="회원 탈퇴"
          description="계정과 모든 데이터가 영구적으로 삭제됩니다. 복구할 수 없습니다."
          action={<AccountWithdrawDialog />}
        />
      </div>
    </div>
  );
}
