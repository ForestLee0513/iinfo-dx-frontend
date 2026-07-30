"use client";

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

import { Avatar, AvatarFallback, Button, Skeleton, buttonVariants } from "@forestlee0513/iinfo-dx-design-system";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";
import { useMobileMenu } from "../contexts/MobileMenuContext";
import { PROFILE_HREF } from "../constants";

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

  // 데스크톱에선 아바타 드롭다운이 프로필 진입점이므로, 모바일에선 계정 정보 행 자체를 프로필 링크로 둔다.
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={PROFILE_HREF}
        onClick={close}
        aria-label="프로필"
        className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground"
      >
        <Avatar size="sm">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium">프로필</span>
          <span className="truncate text-xs text-muted-foreground">{myInfo.data.email}</span>
        </div>
        <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
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
