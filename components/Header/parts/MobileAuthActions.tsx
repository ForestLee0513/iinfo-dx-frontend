"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, Button, Skeleton, buttonVariants } from "@forestlee0513/iinfo-dx-design-system";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";
import { useMobileMenu } from "../contexts/MobileMenuContext";

// 로그인/회원가입은 이동과 동시에 사이드바를 닫고,
// 로그아웃은 요청이 성공한 뒤에 닫는다(실패 시엔 열어둬 재시도할 수 있게).
export function MobileAuthActions() {
  const myInfo = useMyInfoQuery();
  const logout = useLogoutMutation();
  const { close } = useMobileMenu();

  if (myInfo.isPending) {
    return (
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    );
  }

  if (!myInfo.data) {
    return (
      <div className="flex gap-2">
        <Link
          href="/login"
          onClick={close}
          className={buttonVariants({ variant: "outline", className: "flex-1" })}
        >
          로그인
        </Link>
        <Link
          href="/sign-up"
          onClick={close}
          className={buttonVariants({ className: "flex-1" })}
        >
          회원가입
        </Link>
      </div>
    );
  }

  const initial = myInfo.data.email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate text-sm text-muted-foreground">{myInfo.data.email}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={logout.isPending}
        onClick={() => logout.mutate(undefined, { onSuccess: close })}
      >
        {logout.isPending ? "로그아웃 중..." : "로그아웃"}
      </Button>
    </div>
  );
}
