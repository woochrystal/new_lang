/**
 * @fileoverview 통합 인증 훅
 * @description 통합 인증 인터페이스
 */

import { useAuthStore } from './authStore';

/**
 * 통합 인증 Hook
 * @returns {Object} 인증 관련 기능
 */
export const useAuth = () => {
  // 상태 구독
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const accessToken = useAuthStore((state) => state.accessToken);

  // 액션
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const loadProfile = useAuthStore((state) => state.loadProfile);
  const clearError = useAuthStore((state) => state.clearError);
  const setUser = useAuthStore((state) => state.setUser);
  const hasValidTokens = useAuthStore((state) => state.hasValidTokens);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getTokenExpirationMinutes = useAuthStore((state) => state.getTokenExpirationMinutes);

  // 새로운 토큰 상태 함수들
  const isAccessTokenValid = useAuthStore((state) => state.isAccessTokenValid);
  const isRefreshTokenValid = useAuthStore((state) => state.isRefreshTokenValid);
  const needsTokenRefresh = useAuthStore((state) => state.needsTokenRefresh);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
  const getTokenStatus = useAuthStore((state) => state.getTokenStatus);
  const getTokenDebugInfo = useAuthStore((state) => state.getTokenDebugInfo);

  return {
    // 사용자 정보
    user,
    isAuthenticated: isAuthenticated(),
    hasValidTokens: hasValidTokens(),

    // 권한 정보
    hasPermission: (permission) => {
      // 개발 환경 권한 우회
      if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
        return true;
      }

      // 동적 권한 시스템 사용
      if (!user?.permissions || !Array.isArray(user.permissions)) {
        return false;
      }

      // 와일드카드 권한 매칭 사용
      const { hasWildcardPermission } = require('./permissionService');
      return hasWildcardPermission(user.permissions, permission);
    },

    // 상태
    isLoading,
    error,
    accessToken,

    // 액션
    login,
    logout,
    loadProfile,
    clearError,
    setUser,

    // 유틸리티
    getTokenExpirationMinutes: getTokenExpirationMinutes(),

    // 세밀한 토큰 상태 제어
    tokenStatus: {
      // 개별 토큰 유효성
      accessToken: isAccessTokenValid(),
      refreshToken: isRefreshTokenValid(),

      // 종합 상태
      hasAnyValidToken: hasValidTokens(),
      needsRefresh: needsTokenRefresh(),
      isExpired: isTokenExpired(),

      // 상태 요약
      status: getTokenStatus(), // 'active' | 'refresh-needed' | 'expired'

      // 만료 시간 정보
      accessExpiresInMinutes: getTokenExpirationMinutes(),

      // 디버깅 정보 (개발 환경에서만)
      ...(process.env.NODE_ENV !== 'production' && {
        debugInfo: getTokenDebugInfo()
      })
    },

    // 개발 환경 정보
    isDevelopmentMode: process.env.NODE_ENV !== 'production',
    isBypassingAuth: process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
  };
};
