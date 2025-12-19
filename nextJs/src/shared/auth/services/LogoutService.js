/*
 * path           : src/shared/auth/LogoutService.js
 * fileName       : LogoutService
 * author         : changhyeon
 * date           : 25. 11. 10.
 * description    : 로그아웃 로직 통합 서비스
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 10.       changhyeon       최초 생성
 * 25. 11. 11.       changhyeon       ABAC 마이그레이션으로 권한 캐시 클리어 제거
 */

import { authApi } from '@/shared/auth/authApi';
import { broadcastLogout } from '@/shared/auth/utils/logoutSync';
import { getLoginPath, LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('LogoutService');

/**
 * 로그아웃 로직 통합 서비스
 *
 * authStore, tenantMismatchHandler 등 여러 곳에서 산재된 로그아웃 로직을
 * 하나의 서비스로 통합하여 일관성을 보장합니다.
 *
 * 처리 순서:
 * 1. 권한 캐시 클리어
 * 2. 백엔드 로그아웃 요청 (fire-and-forget)
 * 3. 토큰 및 스토리지 정리
 * 4. 로그인 경로 계산
 * 5. Zustand 스토어 정리
 * 6. 탭 간 동기화
 * 7. 로그인 페이지로 리다이렉트
 */
class LogoutService {
  constructor() {
    this.isLoggingOut = false;
  }

  /**
   * 로그아웃 실행
   * 이미 진행 중이면 즉시 반환 (중복 실행 방지)
   */
  async logout() {
    if (this.isLoggingOut) {
      logger.debug('[LogoutService] Logout already in progress, skipping');
      return;
    }

    this.isLoggingOut = true;
    let loginPath = '/';

    try {
      logger.info('[LogoutService] Starting logout');

      // 지연 import로 순환 참조 방지 및 스토어 접근
      const { useTokenStore, useTenantStore, useMenuStore, useAuthStore } = await import('@/shared/store');

      // 1. 로그인 경로 계산 (Zustand 상태 기반)
      // 스토어가 초기화되기 전에 현재 테넌트 경로를 확보하여 정확한 로그인 페이지로 이동loginPath = getLoginPath();
      loginPath = getLoginPath();

      // 2. 백엔드 로그아웃 요청 (fire-and-forget)
      const { refreshToken } = useTokenStore.getState();

      if (refreshToken) {
        authApi.logout(refreshToken).catch((err) => {
          logger.warn('[LogoutService] Server logout request failed:', err.message);
        });
      }

      // 3. 클라이언트 토큰 정리
      useTokenStore.getState().clearTokens();

      // 4. 세션 스토리지 정리 (공용 PC 보안: returnUrl 등 민감 정보 제거)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('loginReturnUrl'); // 명시적으로 제거
        sessionStorage.clear();
      }

      // 5. Zustand 스토어 정리
      useTenantStore.getState().clearTenant();
      useMenuStore.getState().clearMenu();
      useAuthStore.setState({
        user: null,
        returnUrl: null, // returnUrl 초기화
        isLoggingOut: false,
        initialLoadAttempted: false
      });

      // 6. 탭 간 동기화
      broadcastLogout();

      logger.info('[LogoutService] Logout completed successfully');

      // 7. 리다이렉트 (SSR 환경 체크)
      if (typeof window !== 'undefined') {
        // location.replace는 히스토리에 남지 않아서 중복 리다이렉션 방지
        window.location.replace(loginPath);
      }
    } catch (err) {
      logger.error('[LogoutService] Logout failed with error:', err);
      // 에러 발생해도 이미 clearTokens()가 실행되었으므로
      // 로그인 페이지로 강제 이동하여 안전 상태 복구
      try {
        if (typeof window !== 'undefined') {
          window.location.replace(loginPath);
        }
      } catch (redirectErr) {
        logger.error('[LogoutService] Failed to redirect to login page:', redirectErr);
      }
    } finally {
      // 항상 isLoggingOut 상태 초기화
      this.isLoggingOut = false;
    }
  }

  /**
   * 로그아웃 상태 확인
   * @returns {boolean}
   */
  isInProgress() {
    return this.isLoggingOut;
  }
}

// 싱글톤 인스턴스
export const logoutService = new LogoutService();
