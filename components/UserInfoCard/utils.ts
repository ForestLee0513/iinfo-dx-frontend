import type { UseQueryResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import type { AuthMyInfoResponse } from "@/api/auth/types";

/**
 * me 쿼리 결과가 "미인증"인지 판별한다.
 * - data === null: 부트스트랩이 미로그인으로 확정한 상태 (401 에러 없이)
 * - 401 에러: axios 인터셉터의 refresh 재시도까지 실패한 최종 미인증
 * 그 외의 에러는 일시적 조회 실패로 본다.
 */
export function isUnauthorized(
  myInfo: UseQueryResult<AuthMyInfoResponse | null>,
): boolean {
  return (
    myInfo.data === null ||
    (isAxiosError(myInfo.error) && myInfo.error.response?.status === 401)
  );
}
