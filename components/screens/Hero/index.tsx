"use client";

import Link from "next/link";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { searchProfiles } from "@/api/profile/requests";

import UserSearchForm from "./parts/UserSearchForm";

import type { SearchFormValues } from "./types";

const INITIAL_SEARCH_VALUES: SearchFormValues = {
  identifier: "",
  service: "iidx",
};

export function Hero() {
  const router = useRouter();

  async function handleSearch({ identifier, service }: SearchFormValues) {
    const query = identifier.trim();
    if (!query) return;

    try {
      const { results } = await searchProfiles({ q: query, service, limit: 1 });
      const firstResult = results[0];
      if (firstResult) router.push(firstResult.profile_path);
    } catch {
      // 검색 결과를 가져오지 못하면 현재 페이지를 유지한다.
    }
  }

  return (
    <section className="flex flex-1 justify-center px-4 py-16 text-center md:py-20">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          IInfo DX
        </h1>

        <p className="text-muted-foreground">
          beatmania IIDX의 비공식 난이도표를 쉽고 간편하게 관리할 수 있습니다.
          <br />
          e-Amusement 기반 데이터 연동, 프로필 생성 / 공유 기능을 제공합니다.
        </p>

        <p className="text-sm text-muted-foreground">
          해당 웹 서비스는 비공식 팬 사이트이며, ‘beatmania IIDX’의 권리는
          ‘Konami Amusement’의 소유입니다.
          <br />
          계속 진행함으로써{" "}
          <Link href="#" className="text-primary underline underline-offset-2">
            이용약관·개인정보 처리방침·데이터 정책
          </Link>
          에 동의한 것으로 간주됩니다.
        </p>

        <Formik initialValues={INITIAL_SEARCH_VALUES} onSubmit={handleSearch}>
          <UserSearchForm />
        </Formik>
      </div>
    </section>
  );
}
