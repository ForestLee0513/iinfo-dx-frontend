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

  // /settings는 AuthGuard로 보호된 라우트라, 로그아웃 성공 후에 이동하면 그 사이
  // me 캐시가 비면서 AuthGuard가 먼저 반응해 로그인 페이지로 보내버리는 경합이
  // 있었다(이 페이지로 돌아오라는 ?redirect= 까지 붙어서). 홈은 인증이 필요 없는
  // 라우트라 먼저 이동해두면 그 경합 자체가 생기지 않는다 — 로그아웃 요청은
  // 이동과 무관하게 백그라운드에서 계속 진행된다.
  function handleLogout() {
    router.replace("/");
    logout.mutate(undefined, {
      onSuccess: () => {
        sessionStorage.removeItem("handle_setup_redirected");
      },
    });
  }

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
              onClick={handleLogout}
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
