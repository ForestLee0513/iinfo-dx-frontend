"use client";

import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  buttonVariants,
} from "@forestlee0513/iinfo-dx-design-system";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";
import { PROFILE_HREF } from "../constants";

export function DesktopAuthActions() {
  const myInfo = useMyInfoQuery();
  const logout = useLogoutMutation();

  if (myInfo.isPending) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!myInfo.data) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          로그인
        </Link>
        <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
          회원가입
        </Link>
      </div>
    );
  }

  const initial = myInfo.data.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="프로필 메뉴"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar size="sm">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <span className="block max-w-48 truncate text-sm">{myInfo.data.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Menu.Item의 render로 <a>를 넘겨 메뉴 항목 시맨틱을 유지한 채 링크로 이동한다(클릭 시 메뉴는 자동으로 닫힘). */}
          <DropdownMenuItem render={<Link href={PROFILE_HREF} />}>
            프로필
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
          >
            {logout.isPending ? "로그아웃 중..." : "로그아웃"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
