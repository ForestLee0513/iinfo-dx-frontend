import { redirect } from "next/navigation";

import { UserInfoCard } from "@/components/UserInfoCard";

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
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold">IInfo DX</h1>
      <UserInfoCard />
    </main>
  );
}
