"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";

import {
  Button,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  buttonVariants,
} from "@forestlee0513/iinfo-dx-design-system";

import { MobileMenuContext } from "./contexts/MobileMenuContext";
import { DesktopAuthActions } from "./parts/DesktopAuthActions";
import { DesktopNav } from "./parts/DesktopNav";
import { MobileAuthActions } from "./parts/MobileAuthActions";
import { MobileNav } from "./parts/MobileNav";

// shadcn 사이트 헤더 형태(로고 + 텍스트 네비 + 로그인/회원가입, 모바일은 Sheet)를 따른 전 페이지 공통 상단 바.
export function Header() {
  // 모바일 Sheet는 로그아웃 완료 시점처럼 SheetClose로 다룰 수 없는 닫기가 있어 제어 컴포넌트로 둔다.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const close = useCallback(() => setMobileMenuOpen(false), []);
  const mobileMenu = useMemo(() => ({ close }), [close]);

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

        <div className="hidden md:flex">
          <DesktopAuthActions />
        </div>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              aria-label="메뉴 열기"
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <IconMenu2 className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="flex w-72 flex-col p-0"
            >
              <MobileMenuContext.Provider value={mobileMenu}>
                <SheetHeader className="flex-row items-center justify-between border-b px-4 py-3">
                  <SheetTitle className="text-base font-bold">
                    IInfo DX
                  </SheetTitle>
                  <SheetClose
                    aria-label="메뉴 닫기"
                    render={<Button variant="ghost" size="icon-sm" />}
                  >
                    <IconX className="size-4" />
                    <span className="sr-only">닫기</span>
                  </SheetClose>
                </SheetHeader>
                <MobileNav />
                <SheetFooter className="mt-auto border-t px-4 py-3">
                  <MobileAuthActions />
                </SheetFooter>
              </MobileMenuContext.Provider>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
