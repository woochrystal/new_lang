/**
 * @fileoverview 통합 인증 & 토큰 관리 Zustand 스토어
 * @description 인증 상태, 토큰 관리, 비즈니스 로직을 포함한 통합 스토어
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { redirectToLogin } from '@/shared/lib/routing';

import { LoggerFactory } from '../lib/logger';

import { authApi } from './authApi';
import { clearTokensFromStorage, isTokenValid, loadTokensFromStorage, saveTokensToStorage } from './tokenService';

// 로거 인스턴스 생성
const logger = LoggerFactory.getLogger('AuthStore');

/**
 * 통합 인증 & 토큰 관리 Store
 */
export const useAuthStore = create(
  immer((set, get) => ({
    // 사용자 상태
    user: null,
    isLoading: false,
    error: null,

    // 토큰 상태
    accessToken: null,
    refreshToken: null,
    accessTokenExpiration: null,
    refreshTokenExpiration: null,

    // 초기화
    initialize: () => {
      if (typeof window === 'undefined') {
        return;
      }

      const tokenData = loadTokensFromStorage();

      set((state) => {
        state.accessToken = tokenData.accessToken;
        state.refreshToken = tokenData.refreshToken;
        state.accessTokenExpiration = tokenData.accessTokenExpiration;
        state.refreshTokenExpiration = tokenData.refreshTokenExpiration;
      });
    },

    // 토큰 관리
    setTokens: (accessToken, refreshToken, accessExpiresIn, refreshExpiresIn) => {
      const currentTime = Date.now();
      const accessExpiration = accessExpiresIn ? currentTime + accessExpiresIn * 1000 : null;
      const refreshExpiration = refreshExpiresIn ? currentTime + refreshExpiresIn * 1000 : null;

      set((state) => {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.accessTokenExpiration = accessExpiration;
        state.refreshTokenExpiration = refreshExpiration;
      });

      saveTokensToStorage(accessToken, refreshToken, accessExpiresIn, refreshExpiresIn);
    },

    setAccessToken: (accessToken, accessExpiresIn) => {
      const accessExpiration = accessExpiresIn ? Date.now() + accessExpiresIn * 1000 : null;

      set((state) => {
        state.accessToken = accessToken;
        state.accessTokenExpiration = accessExpiration;
      });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('accessToken', accessToken);
          if (accessExpiresIn) {
            localStorage.setItem('accessTokenExpiration', accessExpiration.toString());
          }
        } catch (error) {
          logger.error('액세스 토큰 저장 실패: {}', error);
        }
      }
    },

    clearTokens: () => {
      set((state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.accessTokenExpiration = null;
        state.refreshTokenExpiration = null;
      });

      clearTokensFromStorage();
    },

    // 토큰 검증
    hasValidTokens: () => {
      const store = get();
      return store.isAccessTokenValid() || store.isRefreshTokenValid();
    },

    isAccessTokenValid: () => {
      const { accessToken, accessTokenExpiration } = get();
      return accessToken && isTokenValid(accessTokenExpiration);
    },

    isRefreshTokenValid: () => {
      const { refreshToken, refreshTokenExpiration } = get();

      if (!refreshToken) {
        return false;
      }

      // refreshTokenExpiration이 없으면 토큰 존재만으로 유효하다고 판단
      // 실제 유효성은 백엔드에서 /auth/refresh 호출 시 확인
      if (!refreshTokenExpiration) {
        return true;
      }

      return isTokenValid(refreshTokenExpiration);
    },

    getTokenExpirationMinutes: () => {
      const { accessTokenExpiration } = get();

      if (!accessTokenExpiration) {
        return 0;
      }

      const currentTime = Date.now();
      const remainingTime = accessTokenExpiration - currentTime;

      return Math.max(0, Math.floor(remainingTime / (60 * 1000)));
    },

    // 토큰 갱신이 필요한지 확인
    needsTokenRefresh: () => {
      const store = get();
      return !store.isAccessTokenValid() && store.isRefreshTokenValid();
    },

    // 토큰 만료 여부
    isTokenExpired: () => {
      const store = get();
      return !store.isAccessTokenValid() && !store.isRefreshTokenValid();
    },

    // 토큰 상태 요약 (개발/디버깅)
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

    // 토큰 상태 디버깅 정보
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
    },

    // 인증 비즈니스 로직
    login: async (credentials) => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        const response = await authApi.login(credentials);

        // 토큰 저장
        const { setTokens } = get();
        setTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn,
          response.refreshExpiresIn || 7 * 24 * 60 * 60
        );

        // 사용자 정보 저장
        set((state) => {
          state.user = response.user || null;
          state.isLoading = false;
          state.error = null;
        });

        return response;
      } catch (error) {
        logger.error('로그인 실패: {}', error);

        set((state) => {
          state.user = null;
          state.isLoading = false;
          state.error = error.message || '로그인에 실패했습니다.';
        });

        throw error;
      }
    },

    logout: async () => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        // 서버에 로그아웃 요청
        try {
          await authApi.logout();
        } catch (logoutError) {
          logger.warn('서버 로그아웃 실패: {}', logoutError);
        }

        // 로컬 상태 정리
        const { clearTokens } = get();
        clearTokens();

        set((state) => {
          state.user = null;
          state.isLoading = false;
          state.error = null;
        });

        // 로그인 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
          redirectToLogin();
        }
      } catch (error) {
        logger.error('로그아웃 실패: {}', error);

        set((state) => {
          state.isLoading = false;
          state.error = error.message || '로그아웃에 실패했습니다.';
        });
      }
    },

    loadProfile: async () => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        // /api/auth/me에서 사용자 정보 + 권한을 한 번에 가져옴
        const userData = await authApi.getCurrentUser();

        // 사용자 정보 저장
        set((state) => {
          state.user = userData;
          state.isLoading = false;
          state.error = null;
        });

        return userData;
      } catch (error) {
        logger.error('프로필 로드 실패: {}', error);

        set((state) => {
          state.user = null;
          state.isLoading = false;
          state.error = error.message || '사용자 정보를 불러올 수 없습니다.';
        });

        // 401 에러인 경우 토큰 정리
        if (error.response?.status === 401) {
          const { clearTokens } = get();
          clearTokens();
        }

        throw error;
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    // 개발 환경 지원
    setUser: (userData) => {
      set((state) => {
        state.user = userData;
        state.isLoading = false;
        state.error = null;
      });
    },

    // 인증 상태 확인
    isAuthenticated: () => {
      const { hasValidTokens, user } = get();
      return hasValidTokens() && user !== null;
    }
  }))
);

// 브라우저 환경에서 자동 초기화
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}
