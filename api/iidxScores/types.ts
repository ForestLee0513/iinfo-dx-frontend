/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token

북마크릿에서 사용할 단기 업로드 토큰을 발급한다 (1시간 유효).
*/
export interface UploadTokenResponse {
  token: string;
  expires_in: number;
}
