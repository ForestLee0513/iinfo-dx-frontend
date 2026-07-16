"use client";

import { createContext, useContext } from "react";

/*
부트스트랩 완료 여부 컨텍스트를 별도 모듈로 분리한다 —
AuthProvider와 api/auth/requests가 서로를 import하는 순환 의존을 끊기 위함.
- false: 세션 복원(/refresh) 진행 중 — me 쿼리 비활성
- true : me 캐시가 채워짐(로그인=user 객체 / 미로그인=null)
*/
export const AuthReadyContext = createContext(false);

export const useAuthReady = () => useContext(AuthReadyContext);
