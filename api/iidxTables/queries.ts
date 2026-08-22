import { queryOptions, useQuery } from "@tanstack/react-query";

import { getTableBoard, listTables } from "./requests";
import type { TableBoardParams } from "./types";

/*
쿼리 키 - Query Keys
*/
export const iidxTablesKeys = {
  all: ["iidxTables"] as const,
  list: () => [...iidxTablesKeys.all, "list"] as const,
  // 서열표는 대상(identifier)·비교 상대(opponent) 조합별로 캐시를 분리한다.
  board: (slug: string, identifier: string | undefined, opponent: string | undefined) =>
    [...iidxTablesKeys.all, slug, "board", identifier ?? "self", opponent ?? "none"] as const,
};

/*
GET /api/v1/iidx/tables
난이도표 목록 조회 - List Tables
*/
export function tablesQueryOptions() {
  return queryOptions({
    queryKey: iidxTablesKeys.list(),
    queryFn: listTables,
  });
}

export function useTablesQuery() {
  return useQuery(tablesQueryOptions());
}

/*
GET /api/v1/iidx/tables/{slug}/board
난이도표 서열표 (클리어 램프 / 사용자 비교) - Get Table Board
*/
export function tableBoardQueryOptions({ slug, identifier, opponent }: TableBoardParams) {
  return queryOptions({
    queryKey: iidxTablesKeys.board(slug, identifier, opponent),
    queryFn: () => getTableBoard({ slug, identifier, opponent }),
  });
}

// slug가 아직 없으면(난이도표 목록 로딩 전 등) 쿼리를 비활성화한다.
export function useTableBoardQuery(
  params: Omit<TableBoardParams, "slug"> & { slug: string | undefined },
) {
  return useQuery({
    ...tableBoardQueryOptions({ ...params, slug: params.slug ?? "" }),
    enabled: Boolean(params.slug),
  });
}
