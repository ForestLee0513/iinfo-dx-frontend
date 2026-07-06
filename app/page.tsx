import { UserInfoCard } from "@/components/UserInfoCard";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold">IInfo DX</h1>
      <UserInfoCard />
    </main>
  );
}
