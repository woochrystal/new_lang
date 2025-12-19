/*
 * path           : src/shared/store/tokenStore.js
 * fileName       : tokenStore
 * author         : changhyeon
 * date           : 25. 11. 07.
 * description    : Access/Refresh 토큰 유효성 관리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 07.       changhyeon       인증 우회시 백엔드 데이터 모킹 처리
 * 25. 11. 07.       changhyeon       레이스 컨디션 방지를 위한 하이드레이션 가드 추가
 * 25. 11. 11.       changhyeon       hasValidTokensAfterHydration 함수 추가 (Hydration 상태 고려)
 */

import { create } from 'zustand';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('TokenStore');

/**
 * 토큰 저장소
 * - Access Token / Refresh Token 관리
 * - 토큰 생명주기 관리 (만료 시간, 유효성 검사)
 * - localStorage 동기화
 */
export const useTokenStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Hydration 상태
        _hasHydrated: false,

        setHydrated: (value) => set({ _hasHydrated: value }),

        // 상태
        accessToken: null,
        refreshToken: null,
        accessTokenExpiration: null,
        refreshTokenExpiration: null,

        // 액션: 토큰 저장/업데이트
        // serverTime: 서버 시간 (밀리초, optional) - 폴백 : 클라이언트 시간 사용
        setTokens: (accessToken, refreshToken, accessExpiresIn, refreshExpiresIn, serverTime) => {
          const currentTime = serverTime || Date.now();
          const accessExpiration = accessExpiresIn ? currentTime + accessExpiresIn * 1000 : null;
          const refreshExpiration = refreshExpiresIn ? currentTime + refreshExpiresIn * 1000 : null;

          set({
            accessToken,
            refreshToken,
            accessTokenExpiration: accessExpiration,
            refreshTokenExpiration: refreshExpiration
          });
        },

        setAccessToken: (accessToken, accessExpiresIn, serverTime) => {
          const currentTime = serverTime || Date.now();
          const accessExpiration = accessExpiresIn ? currentTime + accessExpiresIn * 1000 : null;
          set({
            accessToken,
            accessTokenExpiration: accessExpiration
          });
        },

        clearTokens: () => {
          set({
            accessToken: null,
            refreshToken: null,
            accessTokenExpiration: null,
            refreshTokenExpiration: null
          });
        },

        // 액션: 토큰 조회
        getAccessToken: () => get().accessToken,
        getRefreshToken: () => get().refreshToken,

        // 액션: 토큰 검증
        isTokenValid: (expiration) => {
          if (!expiration) {
            return false;
          }
          return Date.now() < expiration;
        },

        isAccessTokenValid: () => {
          const { accessToken, accessTokenExpiration } = get();
          if (!accessToken || !accessTokenExpiration) {
            return false;
          }
          return Date.now() < accessTokenExpiration;
        },

        isRefreshTokenValid: () => {
          const { refreshToken, refreshTokenExpiration } = get();
          if (!refreshToken || !refreshTokenExpiration) {
            return false;
          }
          return Date.now() < refreshTokenExpiration;
        },

        hasValidTokens: () => {
          const store = get();
          return store.isAccessTokenValid() || store.isRefreshTokenValid();
        },

        /**
         * Hydration 상태를 고려한 토큰 유효성 검사
         *
         * localStorage로부터 상태 복원이 완료된 후에만 토큰 유효성을 판단합니다.
         * SSR 환경에서 hydration 경쟁 상태(race condition)를 방지합니다.
         *
         * @returns {boolean} Hydration 완료 후 토큰이 유효한지 여부
         */
        hasValidTokensAfterHydration: () => {
          const state = get();
          if (!state._hasHydrated) {
            return false;
          }
          return state.hasValidTokens();
        },

        needsTokenRefresh: () => {
          const store = get();
          return !store.isAccessTokenValid() && store.isRefreshTokenValid();
        },

        isTokenExpired: () => {
          const store = get();
          return !store.isAccessTokenValid() && !store.isRefreshTokenValid();
        },

        // 액션: 토큰 정보 조회
        getAccessTokenExpirationMinutes: () => {
          const { accessTokenExpiration } = get();
          if (!accessTokenExpiration) {
            return 0;
          }
          const currentTime = Date.now();
          const remainingTime = accessTokenExpiration - currentTime;
          return Math.max(0, Math.floor(remainingTime / (60 * 1000)));
        },

        getTokenStatus: () => {
          const store = get();
          if (store.isAccessTokenValid()) {
            return 'active';
          }
          if (store.isRefreshTokenValid()) {
            return 'refresh-needed';
          }
          return 'expired';
        },

        getTokenDebugInfo: () => {
          const { accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration } = get();
          const store = get();
          return {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            accessTokenValid: store.isAccessTokenValid(),
            refreshTokenValid: store.isRefreshTokenValid(),
            tokenStatus: store.getTokenStatus(),
            accessExpiresInMinutes: accessTokenExpiration
              ? Math.max(0, Math.floor((accessTokenExpiration - Date.now()) / 1000 / 60))
              : null,
            refreshExpiresInMinutes: refreshTokenExpiration
              ? Math.max(0, Math.floor((refreshTokenExpiration - Date.now()) / 1000 / 60))
              : null,
            needsRefresh: store.needsTokenRefresh(),
            isExpired: store.isTokenExpired()
          };
        }
      }),
      {
        name: 'pentaware-token', // localStorage에 저장될 키 이름
        storage: createJSONStorage(() => localStorage), // 사용할 스토리지
        // partialize: (state) => ({ ... }), // 특정 필드만 저장하고 싶을 때 사용
        onRehydrateStorage: () => (state) => {
          // Hydration 완료 후 _hasHydrated를 true로 설정
          if (state) {
            state.setHydrated(true);
          }
        },
        onError: (error) => {
          logger.error('[TokenStore] persist error:', error);
        }
      }
    )
  )
);
