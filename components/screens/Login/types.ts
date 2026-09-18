export type LoginProps = {
  error?: string | string[];
  // 서버 컴포넌트(app/(auth)/login/page.tsx)에서 이미 검증을 마친 값 — 여기서 다시 검증하지 않는다.
  redirect?: string;
};
