import { useMutation } from "@tanstack/react-query";

import { createUploadToken } from "./requests";

/*
쿼리 키 - Query Keys
*/
export const iidxScoresKeys = {
  all: ["iidxScores"] as const,
};

/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token
*/
export function useCreateUploadTokenMutation() {
  return useMutation({
    mutationFn: createUploadToken,
  });
}
