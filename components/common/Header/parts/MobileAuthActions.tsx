"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconChevronRight } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useLogoutMutation, useMyInfoQuery } from "@/api/auth/queries";
import { useMobileMenu } from "../contexts/MobileMenuContext";
import { getProfileHref, SETTINGS_HREF } from "../constants";

// 로그인/로그아웃 모두 이동과 동시에 사이드바를 닫는다. 로그아웃은 홈으로 먼저
// 이동한 뒤 요청을 보낸다 — 설정 등 보호된 라우트에서 누르면, 성공 후 이동하는
// 사이 me 캐시가 비면서 AuthGuard가 먼저 반응해 로그인 페이지로 보내버리는 경합이
// 있었다(인증이 필요 없는 홈으로 먼저 이동해두면 그 경합 자체가 생기지 않는다).
export function MobileAuthActions() {
  const router = useRouter();
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
      <Button
        className="w-full"
        nativeButton={false}
        render={<Link href="/login" onClick={close} />}
      >
        로그인
      </Button>
    );
  }

  const initial = (myInfo.data.email ?? myInfo.data.id).charAt(0).toUpperCase();

  function handleLogout() {
    close();
    router.replace("/");
    logout.mutate(undefined, {
      onSuccess: () => {
        sessionStorage.removeItem("handle_setup_redirected");
      },
    });
  }

  // 데스크톱에선 아바타 드롭다운이 프로필 진입점이므로, 모바일에선 계정 정보 행 자체를 프로필 링크로 둔다.
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={getProfileHref(myInfo.data.id)}
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
      <Link
        href={SETTINGS_HREF}
        onClick={close}
        className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        설정
        <IconChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </Link>
      <Button
        variant="outline"
        size="sm"
        disabled={logout.isPending}
        onClick={handleLogout}
      >
        {logout.isPending ? "로그아웃 중..." : "로그아웃"}
      </Button>
    </div>
  );
}
