/**
 * @fileoverview 라우팅 유틸리티
 * @description 멀티테넌트 환경을 고려한 동적 라우팅 처리
 *
 * 사용법:
 * import { getLoginPath, redirectToLogin } from '@/shared/lib/routing'
 * const loginPath = getLoginPath()
 * redirectToLogin() // 현재 페이지에서 로그인 페이지로 리다이렉트
 */

// ============================================================================
// SSR 유틸리티
// ============================================================================

/**
 * SSR(서버사이드) 환경 여부 확인
 * @returns {boolean} SSR 환경 여부
 */
const isSSR = () => typeof window === 'undefined';

/**
 * SSR 환경에서는 defaultValue 반환, 클라이언트에서는 clientFn 실행
 * @param {Function} clientFn - 클라이언트에서 실행할 함수
 * @param {*} defaultValue - SSR에서 반환할 기본값
 * @returns {*} 환경에 따른 반환값
 */
const withSSRSafety = (clientFn, defaultValue = null) => {
  return isSSR() ? defaultValue : clientFn();
};

/**
 * 테넌트 모드 확인 (환경변수 기반)
 * @returns {'single'|'multi'} 테넌트 모드
 * @throws {Error} 환경변수가 설정되지 않은 경우
 */
const getTenantMode = () => {
  const tenantMode = process.env.NEXT_PUBLIC_TENANT_MODE;

  if (tenantMode === 'multi') {
    return 'multi';
  }
  if (tenantMode === 'single') {
    return 'single';
  }

  throw new Error(
    'NEXT_PUBLIC_TENANT_MODE 환경변수가 설정되지 않았습니다. ' +
      '.env 파일에서 NEXT_PUBLIC_TENANT_MODE=single 또는 NEXT_PUBLIC_TENANT_MODE=multi로 설정해주세요.'
  );
};

/**
 * 환경변수 기반 기본 경로 세그먼트
 * @returns {string} 기본 경로 세그먼트
 * @throws {Error} 단일 테넌트 모드에서 환경변수가 설정되지 않은 경우
 */
const getDefaultSegment = () => {
  const tenantMode = getTenantMode();

  // 멀티테넌트 모드에서는 이 값이 필요없음
  if (tenantMode === 'multi') {
    return ''; // 기본값 (미사용)
  }

  // 단일 테넌트 모드에서만 필수
  const segment = process.env.NEXT_PUBLIC_DEFAULT_ROUTE_SEGMENT;
  if (!segment) {
    throw new Error(
      '단일 테넌트 모드에서는 NEXT_PUBLIC_DEFAULT_ROUTE_SEGMENT 환경변수가 필수입니다. ' +
        '.env 파일에서 NEXT_PUBLIC_DEFAULT_ROUTE_SEGMENT=groupware 형태로 설정해주세요.'
    );
  }
  return segment;
};

// ============================================================================
// 라우팅 함수
// ============================================================================

/**
 * 현재 테넌트의 기본 경로
 *
 * 라우팅 구조:
 * - 단일 테넌트: /{DEFAULT_ROUTE_SEGMENT}/** (예: /groupware/login)
 * - 멀티 테넌트: /[tenant]/** (예: /tenant1/login)
 *
 * @returns {string} 테넌트 기본 경로
 */
export const getTenantBasePath = () => {
  return withSSRSafety(() => {
    const defaultSegment = getDefaultSegment();
    const pathSegments = window.location.pathname.split('/').filter(Boolean);

    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];

      // 기본 세그먼트로 시작하면 단일 테넌트 모드
      if (firstSegment === defaultSegment) {
        return `/${defaultSegment}`;
      }

      // 그 외는 테넌트명으로 간주 (멀티 테넌트 모드)
      return `/${firstSegment}`;
    }

    // 기본값: 단일 테넌트
    return `/${defaultSegment}`;
  }, '');
};

/**
 * 기본 테넌트 경로 생성
 *
 * @returns {string} 기본 테넌트 경로
 */
export const getDefaultBasePath = () => {
  return `/${getDefaultSegment()}`;
};

/**
 * 동적 경로 생성 함수
 *
 * @param {string} path - 생성할 경로 (예: '/vacation', '/member')
 * @returns {string} 테넌트 기반 동적 경로
 * @example
 * createDynamicPath('/vacation') // → '/groupware/vacation' 또는 '/tenant1/vacation'
 */
export const createDynamicPath = (path) => {
  const basePath = isSSR() ? getDefaultBasePath() : getTenantBasePath();
  return `${basePath}${path}`;
};

/**
 * 멀티테넌트 모드 여부 확인
 *
 * @returns {boolean} 멀티테넌트 모드 여부
 * @throws {Error} NEXT_PUBLIC_TENANT_MODE 환경변수가 설정되지 않은 경우
 */
export const isMultiTenantMode = () => {
  return getTenantMode() === 'multi';
};

/**
 * 현재 테넌트 ID 추출
 *
 * @returns {string|null} 테넌트 ID 또는 null (단일 테넌트 모드)
 */
export const getTenantId = () => {
  return withSSRSafety(() => {
    if (!isMultiTenantMode()) {
      return null;
    }

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    return pathSegments.length > 0 ? pathSegments[0] : null;
  }, null);
};

/**
 * 현재 테넌트의 로그인 페이지 경로
 *
 * @returns {string} 로그인 페이지 전체 경로
 */
export const getLoginPath = () => {
  const basePath = getTenantBasePath();

  // 멀티테넌트 모드: /tenant1/login
  // 단일 테넌트 모드: /groupware/login
  return `${basePath}/login`;
};

/**
 * 로그인 페이지 리다이렉트
 *
 * @param {string} [returnUrl] 로그인 후 돌아갈 URL (선택사항)
 */
export const redirectToLogin = (returnUrl) => {
  withSSRSafety(() => {
    const loginPath = getLoginPath();

    // 현재 페이지를 returnUrl로 설정 (로그인 페이지가 아닌 경우)
    if (!returnUrl && !window.location.pathname.includes('login')) {
      const currentPath = window.location.pathname + window.location.search;
      returnUrl = encodeURIComponent(currentPath);
    }

    window.location.href = returnUrl ? `${loginPath}?returnUrl=${returnUrl}` : loginPath;
  });
};

/**
 * 루트페이지 리다이렉트
 */
export const redirectToDashboard = () => {
  withSSRSafety(() => {
    window.location.href = getTenantBasePath();
  });
};

/**
 * 로그인 페이지 여부 확인
 *
 * @returns {boolean} 로그인 페이지 여부
 */
export const isLoginPage = () => {
  return withSSRSafety(() => {
    return window.location.pathname.includes('/login');
  }, false);
};

/**
 * returnUrl 파라미터 파싱
 *
 * @returns {string|null} returnUrl 값 또는 null
 */
export const getReturnUrl = () => {
  return withSSRSafety(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');

    return returnUrl ? decodeURIComponent(returnUrl) : null;
  }, null);
};
