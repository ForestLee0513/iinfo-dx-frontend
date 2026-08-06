import { api } from "@/lib/axios";
import { IIDX_SCORES_TOKEN_URL } from "./constants";
import type { UploadTokenResponse } from "./types";

/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token
*/
export async function createUploadToken() {
  const { data } = await api.post<UploadTokenResponse>(IIDX_SCORES_TOKEN_URL);
  return data;
}
