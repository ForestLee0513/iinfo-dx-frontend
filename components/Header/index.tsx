"use client";

import Link from "next/link";
import { IconMenu2 } from "@tabler/icons-react";

import {
  Separator,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  buttonVariants,
} from "@forestlee0513/iinfo-dx-design-system";

import { DesktopNav } from "./parts/DesktopNav";
import { MobileNav } from "./parts/MobileNav";

// shadcn 사이트 헤더 형태(로고 + 텍스트 네비 + 로그인/회원가입, 모바일은 Sheet)를 따른 전 페이지 공통 상단 바.
export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-4 px-4 md:px-6 xl:px-12">
        <Link
          href="/"
          className="text-base font-bold tracking-tight whitespace-nowrap"
        >
          IInfo DX
        </Link>

        <Separator
          orientation="vertical"
          className="hidden h-6 md:block my-auto"
        />
        <DesktopNav />

        <div className="flex-1" />

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            로그인
          </Link>
          <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
            회원가입
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="메뉴 열기"
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <IconMenu2 className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col p-0">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle className="text-base font-bold">
                  IInfo DX
                </SheetTitle>
              </SheetHeader>
              <MobileNav />
              <SheetFooter className="mt-auto flex-row gap-2 border-t px-4 py-3">
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "outline",
                    className: "flex-1",
                  })}
                >
                  로그인
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({ className: "flex-1" })}
                >
                  회원가입
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
