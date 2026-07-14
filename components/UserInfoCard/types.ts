import type { AuthMyInfoResponse } from "@/api/auth/types";

// 미인증/조회 실패 안내 카드
export interface SignInPromptProps {
  /** true면 미인증(로그인 안 됨), false면 조회 실패 */
  unauthorized: boolean;
}

// 로그인 사용자 정보 카드
export interface ProfileCardProps {
  user: AuthMyInfoResponse;
  /** 로그아웃 요청 진행 중 여부 */
  isLoggingOut: boolean;
  onLogout: () => void;
}
