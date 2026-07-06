import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { AUTH_BASE } from "@/api/auth/constants";
import type { AuthRefreshResponse } from "@/api/auth/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const REFRESH_URL = `${AUTH_BASE}/refresh`;
const LOGIN_URL_PREFIX = `${AUTH_BASE}/login`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 세션 쿠키를 모든 요청에 포함
  headers: {
    "Content-Type": "application/json",
  },
});

// /me 등 HTTPBearer 보호 엔드포인트용 access token (메모리 보관).
// 새로고침으로 사라지면 401 → refresh 인터셉터가 쿠키로 재발급받아 복구한다.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 동시 다발 401에 대해 refresh 요청을 한 번만 보내기 위한 공유 프로미스
let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const isAuthAttempt =
      original?.url === REFRESH_URL ||
      original?.url?.startsWith(LOGIN_URL_PREFIX);

    // 401이면 쿠키 기반 세션 갱신 후 원 요청을 1회 재시도한다.
    // 로그인/갱신 요청 자체의 401은 자격 증명 오류이므로 그대로 전파한다.
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthAttempt
    ) {
      refreshPromise ??= api
        .post<AuthRefreshResponse>(REFRESH_URL)
        .then((response) => {
          setAccessToken(response.data.session.access_token);
        })
        .finally(() => {
          refreshPromise = null;
        });

      try {
        await refreshPromise;
      } catch {
        return Promise.reject(error);
      }

      original._retried = true;
      return api(original);
    }

    return Promise.reject(error);
  },
);
