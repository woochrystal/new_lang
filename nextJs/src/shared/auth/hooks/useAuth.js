/*
 * path           : src/shared/auth/useAuth.js
 * fileName       : useAuth
 * author         : changhyeon
 * date           : 25. 09. 12.
 * description    : 사용자 인증 상태 및 토큰 정보 제공
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 09. 12.       changhyeon       최초 생성
 * 25. 09. 12.       changhyeon       에러 메시지 처리 및 로그인, 권한관리 기능 추가
 * 25. 11. 03.       changhyeon       권한 및 사용자정보 오버라이딩 이슈 해결
 * 25. 11. 11.       changhyeon       토큰 유효성 검사 Hydration 상태 고려
 */

import { useAuthStore, useTokenStore } from '@/shared/store';

/**
 * 통합 인증 훅 - 인증 상태 전용
 *
 * 사용자 인증 상태와 토큰 정보만 제공합니다.
 * 권한 체크는 usePermissions() 훅을 사용하세요.
 *
 * @returns {Object} 인증 정보 및 액션
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 * // 권한이 필요한 경우는 usePermissions() 사용
 * const { hasPermission } = usePermissions();
 */
export const useAuth = () => {
  // 상태 구독
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 액션
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const loadProfile = useAuthStore((state) => state.loadProfile);
  const setUser = useAuthStore((state) => state.setUser);

  // --- Token Store에서 상태 및 함수 가져오기 ---
  const accessToken = useTokenStore((state) => state.accessToken);
  const hasValidTokens = useTokenStore((state) => state.hasValidTokensAfterHydration());
  const getTokenExpirationMinutes = useTokenStore((state) => state.getAccessTokenExpirationMinutes);
  const isAccessTokenValid = useTokenStore((state) => state.isAccessTokenValid);
  const isRefreshTokenValid = useTokenStore((state) => state.isRefreshTokenValid);
  const needsTokenRefresh = useTokenStore((state) => state.needsTokenRefresh);
  const isTokenExpired = useTokenStore((state) => state.isTokenExpired);
  const getTokenStatus = useTokenStore((state) => state.getTokenStatus);
  const getTokenDebugInfo = useTokenStore((state) => state.getTokenDebugInfo);

  return {
    // 사용자 정보
    user,
    isAuthenticated,
    hasValidTokens,

    // 상태
    isLoading,
    accessToken,

    // 액션
    login,
    logout,
    loadProfile,
    setUser,

    // 유틸리티
    getTokenExpirationMinutes,

    // 세밀한 토큰 상태 제어
    tokenStatus: {
      // 개별 토큰 유효성
      accessToken: isAccessTokenValid(),
      refreshToken: isRefreshTokenValid(),

      // 종합 상태
      hasAnyValidToken: hasValidTokens,
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
