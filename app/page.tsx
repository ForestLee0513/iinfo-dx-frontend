import { redirect } from "next/navigation";

import { FeatureSection } from "@/components/FeatureSection";
import { Hero } from "@/components/Hero";

const FEATURES = [
  {
    title: "간편한 데이터 추가",
    description: "e-Amusement 사이트에서 사용자의 플레이 데이터를 간편하게 등록",
    note: (
      <>
        해당 기능을 사용하기 위해서 e-Amusement ‘베이직 코스’ 혹은 ‘프리미엄 코스’ 가입이
        필수입니다.
      </>
    ),
    imagePosition: "start" as const,
  },
  {
    title: "프로필 생성/공유",
    description: (
      <>
        IInfo DX에 프로필을 생성하고 플레이 성과를 공유해보세요.
        <br />
        그리고 생성된 프로필을 기반으로 라이벌과 경쟁 해보세요.
      </>
    ),
    imagePosition: "end" as const,
  },
  {
    title: "리더보드",
    description: "데이터를 등록하여 다른 사용자와 경쟁 해보세요.",
    imagePosition: "start" as const,
  },
  {
    title: "Open API 제공",
    description: (
      <>
        IInfoDX의 서비스를 Open API로 만나보세요.
        <br />
        공개된 사용자의 프로필, 서열표, 리더보드를 Open API로 제공해드립니다.
      </>
    ),
    imagePosition: "end" as const,
  },
];

/*
OAuth 실패 시 백엔드가 redirect(= origin, 즉 이 페이지)에 ?error=<코드>를 붙여
돌려보내므로, 에러가 있으면 로그인 페이지로 넘겨서 메시지를 보여준다
*/
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const oauthError = Array.isArray(error) ? error[0] : error;
  if (oauthError) {
    redirect(`/login?error=${encodeURIComponent(oauthError)}`);
  }

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      {FEATURES.map((feature) => (
        <FeatureSection key={feature.title} {...feature} />
      ))}
    </main>
  );
}
