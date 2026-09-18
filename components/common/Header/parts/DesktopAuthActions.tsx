"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";
import { getProfileHref, SETTINGS_HREF } from "../constants";

export function DesktopAuthActions() {
  const router = useRouter();
  const myInfo = useMyInfoQuery();
  const logout = useLogoutMutation();

  if (myInfo.isPending) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!myInfo.data) {
    return (
      <Button size="sm" nativeButton={false} render={<Link href="/login" />}>
        로그인
      </Button>
    );
  }

  const initial = (myInfo.data.email ?? myInfo.data.id).charAt(0).toUpperCase();

  // 설정 등 보호된 라우트에서 로그아웃하면, 성공 후 이동 사이 me 캐시가 비면서
  // AuthGuard가 먼저 반응해 로그인 페이지로 보내버리는 경합이 있었다 — 인증이
  // 필요 없는 홈으로 먼저 이동해두면 그 경합이 생기지 않는다.
  function handleLogout() {
    router.replace("/");
    logout.mutate(undefined, {
      onSuccess: () => {
        sessionStorage.removeItem("handle_setup_redirected");
      },
    });
  }

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
            <span className="block max-w-48 truncate text-sm">
              {myInfo.data.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Menu.Item의 render로 <a>를 넘겨 메뉴 항목 시맨틱을 유지한 채 링크로 이동한다(클릭 시 메뉴는 자동으로 닫힘). */}
          <DropdownMenuItem
            render={<Link href={getProfileHref(myInfo.data.id)} />}
          >
            프로필
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={SETTINGS_HREF} />}>
            설정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={logout.isPending}
            onClick={handleLogout}
          >
            {logout.isPending ? "로그아웃 중..." : "로그아웃"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
