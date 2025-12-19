/*
 * path           : src/shared/lib/routing.js
 * fileName       : routing
 * author         : changhyeon
 * date           : 25. 10. 22.
 * description    : 멀티테넌트 라우팅 유틸리티 (getTenantId, getLoginPath, redirectToDashboard 등)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 22.       changhyeon       최초 생성
 * 25. 11. 07.       changhyeon       getTenantId() tenantStore 기반으로 변경
 * 25. 11. 07.       changhyeon       getTenantPath() 함수 추가
 * 25. 11. 11.       changhyeon       파일 헤더 추가
 */

import { useAuthStore } from '@/shared/store/authStore'; // authStore도 직접 import 권장 (순환 참조 방지)
import { useTenantStore } from '@/shared/store/tenantStore';

import { isServer } from './envUtils';

// ============================================================================
// SSR 유틸리티
// ============================================================================

const withSSRSafety = (clientFn, defaultValue = null) => {
  return isServer() ? defaultValue : clientFn();
};

// ============================================================================
// 테넌트 정보 조회
// ============================================================================

/**
 * 테넌트 모드 확인 (환경변수 기반)
 * @returns {'single'|'multi'} 테넌트 모드
 */
export const getTenantMode = () => {
  const tenantMode = process.env.NEXT_PUBLIC_TENANT_MODE;
  if (tenantMode === 'multi' || tenantMode === 'single') {
    return tenantMode;
  }
  throw new Error('NEXT_PUBLIC_TENANT_MODE 환경변수가 올바르게 설정되지 않았습니다.');
};

/**
 * 멀티테넌트 모드 여부 확인
 * @returns {boolean} 멀티테넌트 모드 여부
 */
export const isMultiTenantMode = () => {
  return getTenantMode() === 'multi';
};

/**
 * 현재 활성화된 테넌트 ID를 조회합니다.
 * Zustand Store(useTenantStore)에서 테넌트 ID를 조회합니다.
 * @returns {string|null} 현재 테넌트 ID 또는 null
 */
export const getTenantId = () => {
  return withSSRSafety(() => {
    try {
      return useTenantStore.getState().currentTenant?.id || null;
    } catch (error) {
      console.warn('[Routing] Tenant ID 조회 실패:', error);
      return null;
    }
  }, null);
};

/**
 * 현재 활성화된 테넌트의 경로를 조회합니다.
 * Zustand Store(useTenantStore)에서 tenantPath를 조회합니다.
 * @returns {string|null} 현재 테넌트 경로 또는 null
 */
export const getTenantPath = () => {
  return withSSRSafety(() => {
    try {
      return useTenantStore.getState().tenantPath || null;
    } catch (error) {
      console.warn('[Routing] Tenant Path 조회 실패:', error);
      return null;
    }
  }, null);
};

// ============================================================================
// 경로 생성 함수
// ============================================================================

/**
 * 로그인 후 사용하는 동적 경로를 생성합니다.
 * 이 앱의 아키텍처에서는 로그인 후 URL에 테넌트 프리픽스가 없으므로,
 * 입력된 경로를 그대로 반환합니다.
 * @param {string} path - 생성할 경로 (예: '/dashboard')
 * @returns {string} 입력된 경로
 * @example
 * createDynamicPath('/vacation') // → '/vacation'
 */
export const createDynamicPath = (path) => {
  // 로그인 후에는 URL에 테넌트 경로가 포함되지 않음
  return path;
};

/**
 * 현재 테넌트의 로그인 페이지 경로를 반환합니다.
 * @param {string} [tenantPath] - 테넌트 경로 (생략하면 store에서 자동 조회)
 * @returns {string} 로그인 페이지 전체 경로
 * @example
 * getLoginPath('acme') // → '/acme/login'
 * getLoginPath() // → '/{getTenantPath()}/login' 또는 '/'
 */
export const getLoginPath = (tenantPath) => {
  const path = tenantPath || getTenantPath();
  return path ? `/${path}/login` : '/';
};

/**
 * 대시보드 페이지로 리다이렉트합니다.
 */
export const redirectToDashboard = () => {
  withSSRSafety(() => {
    window.location.href = '/dashboard'; // 항상 루트 대시보드로 이동
  });
};

/**
 * 로그인 페이지로 리다이렉트합니다.
 * 인증 실패 등 공통적인 상황에서 호출됩니다.
 * @param {string} [returnUrl] - 로그인 후 돌아갈 URL
 * @param {string} [tenantPath] - 테넌트 경로 (생략하면 store에서 자동 조회)
 */
export const redirectToLogin = (returnUrl, tenantPath) => {
  withSSRSafety(() => {
    try {
      const path = tenantPath || getTenantPath();
      const safeRedirectPath = getLoginPath(path);

      if (!returnUrl && !window.location.pathname.includes('login')) {
        returnUrl = window.location.pathname + window.location.search;
      }

      // returnUrl을 sessionStorage와 useAuthStore에 저장
      if (returnUrl) {
        sessionStorage.setItem('loginReturnUrl', returnUrl);
        useAuthStore.getState().setReturnUrl(returnUrl);
      }

      window.location.href = safeRedirectPath;
    } catch (error) {
      console.error('[Routing] redirectToLogin 에러:', error);
      // 최후의 수단으로 루트 경로로 리다이렉트합니다.
      window.location.href = '/';
    }
  });
};

// ============================================================================
// 기타 유틸리티
// ============================================================================

/**
 * 현재 페이지가 로그인 페이지인지 확인
 * @returns {boolean} 로그인 페이지 여부
 */
export const isLoginPage = () => {
  return withSSRSafety(() => {
    return window.location.pathname.endsWith('/login');
  }, false);
};
