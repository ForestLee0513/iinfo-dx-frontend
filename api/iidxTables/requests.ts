import { api } from "@/lib/axios";
import { IIDX_TABLES_LIST_URL, iidxTableBoardUrl } from "./constants";
import type {
  TableBoardParams,
  TableBoardResponse,
  TableListResponse,
} from "./types";

/*
GET /api/v1/iidx/tables
난이도표 목록 조회 - List Tables
*/
export async function listTables() {
  const { data } = await api.get<TableListResponse>(IIDX_TABLES_LIST_URL);
  return data;
}

/*
GET /api/v1/iidx/tables/{slug}/board
난이도표 서열표 (클리어 램프 / 사용자 비교) - Get Table Board
*/
export async function getTableBoard({ slug, identifier, opponent }: TableBoardParams) {
  const { data } = await api.get<TableBoardResponse>(iidxTableBoardUrl(slug), {
    params: { identifier, opponent },
  });
  return data;
}
