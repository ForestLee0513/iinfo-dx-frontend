"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, Button, Skeleton, buttonVariants } from "@forestlee0513/iinfo-dx-design-system";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";

export function MobileAuthActions() {
  const myInfo = useMyInfoQuery();
  const logout = useLogoutMutation();

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
          className={buttonVariants({ variant: "outline", className: "flex-1" })}
        >
          로그인
        </Link>
        <Link href="/sign-up" className={buttonVariants({ className: "flex-1" })}>
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
        onClick={() => logout.mutate()}
      >
        {logout.isPending ? "로그아웃 중..." : "로그아웃"}
      </Button>
    </div>
  );
}
