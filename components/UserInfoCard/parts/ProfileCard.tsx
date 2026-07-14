import type { ProfileCardProps } from "../types";

// 로그인 사용자 정보 + 로그아웃 버튼
export function ProfileCard({ user, isLoggingOut, onLogout }: ProfileCardProps) {
  return (
    <section className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-gray-200 p-4 text-sm">
      <h2 className="font-bold">내 정보</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-gray-500">이메일</dt>
        <dd>{user.email}</dd>
        <dt className="text-gray-500">가입 경로</dt>
        <dd>{user.provider}</dd>
        <dt className="text-gray-500">권한</dt>
        <dd>{user.app_role}</dd>
        <dt className="text-gray-500">ID</dt>
        <dd className="break-all">{user.id}</dd>
      </dl>
      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="rounded-md bg-gray-900 py-2 text-center font-medium text-white disabled:opacity-50"
      >
        {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
      </button>
    </section>
  );
}
