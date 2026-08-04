"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { buttonVariants, cn } from "@forestlee0513/iinfo-dx-design-system";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 py-16 text-center md:py-20 xl:py-28">
      <h1 className="text-[32px] leading-[40px] font-normal xl:text-[54px] xl:leading-[64px] xl:font-light">
        IInfo DX
      </h1>

      <p className="max-w-[288px] text-base leading-6 text-muted-foreground md:max-w-[483px] break-keep">
        beatmania IIDX의 비공식 난이도표를 쉽고 간편하게 관리할 수 있습니다.
        <br />
        e-Amusement 기반 데이터 연동, 프로필 생성 / 공유 기능을 제공합니다.
      </p>

      <p className="max-w-[288px] text-xs leading-4 tracking-[0.32px] text-muted-foreground/80 md:max-w-[483px]">
        해당 웹 서비스는 비공식 팬 사이트이며, ‘beatmania IIDX’의 권리는 ‘Konami
        Amusement’의 소유입니다.
        <br />
        계속 진행함으로써{" "}
        <Link href="#" className="text-primary underline underline-offset-2">
          이용약관·개인정보 처리방침·데이터 정책
        </Link>
        에 동의한 것으로 간주됩니다.
      </p>

      <Link
        href="/login"
        className={cn(buttonVariants({ size: "lg" }), "gap-2")}
      >
        시작하기
        <IconArrowRight className="size-4" />
      </Link>
    </section>
  );
}
