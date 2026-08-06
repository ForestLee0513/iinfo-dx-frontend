import { api } from "@/lib/axios";
import {
  IIDX_SCORES_SNAPSHOTS_URL,
  IIDX_SCORES_TOKEN_URL,
  iidxScoresRestoreUrl,
} from "./constants";
import type {
  IidxPlayStyle,
  RestoreResponse,
  SnapshotListResponse,
  UploadTokenResponse,
} from "./types";

/*
POST /api/v1/iidx/scores/token
북마크릿 업로드 토큰 발급 - Create Upload Token
*/
export async function createUploadToken() {
  const { data } = await api.post<UploadTokenResponse>(IIDX_SCORES_TOKEN_URL);
  return data;
}

/*
GET /api/v1/iidx/scores/snapshots
성적 스냅샷 목록 - List Snapshots
*/
export async function getSnapshots(style: IidxPlayStyle) {
  const { data } = await api.get<SnapshotListResponse>(
    IIDX_SCORES_SNAPSHOTS_URL,
    { params: { style } },
  );
  return data;
}

/*
POST /api/v1/iidx/scores/restore/{upload_id}
성적 스냅샷 복구 - Restore Snapshot
*/
export async function restoreSnapshot(uploadId: string) {
  const { data } = await api.post<RestoreResponse>(
    iidxScoresRestoreUrl(uploadId),
  );
  return data;
}
