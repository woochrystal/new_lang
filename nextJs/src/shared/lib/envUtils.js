/**
 * @fileoverview 환경 감지 및 검사 유틸리티
 *
 * 환경 감지: isBrowser, isServer, isProduction, isDevelopment, isLocal, isTest, isSSR, isCSR, isNextDev, isDebugMode, isMobile
 * 환경변수: getEnvVar, getPublicEnvVar, getNodeVersion, getEnvironment, getPlatformInfo
 * 환경별 실행: runInBrowser, runInServer, runInDevelopment, runInProduction
 */

/**
 * 브라우저 환경인지 확인합니다.
 * @returns {boolean} 브라우저 환경 여부
 * @example
 * if (isBrowser()) {
 *   window.localStorage.setItem('theme', 'dark');
 *   document.title = 'My App';
 * }
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * 서버 환경(Node.js)인지 확인합니다.
 * @returns {boolean} 서버 환경 여부
 * @example
 * if (isServer()) {
 *   const fs = require('fs');
 *   console.log('서버에서 실행 중:', process.env.NODE_ENV);
 * }
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * 프로덕션 환경인지 확인합니다.
 * @returns {boolean} 프로덕션 환경 여부
 * @example
 * if (isProduction()) {
 *   console.log('프로덕션 환경에서 실행 중');
 *   // 에러 추적, 성능 모니터링 등
 * }
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * 개발 환경인지 확인합니다. (프로덕션이 아닌 모든 환경)
 * @returns {boolean} 개발 환경 여부
 * @example
 * if (isDevelopment()) {
 *   console.log('디버그 정보:', debugData);
 *   // 개발 도구, 상세 로깅 등
 * }
 */
export function isDevelopment() {
  return process.env.NODE_ENV !== 'production';
}

/**
 * 로컬 개발 환경인지 확인합니다.
 * @returns {boolean} 로컬 환경 여부
 */
export function isLocal() {
  return process.env.NODE_ENV === 'local';
}

/**
 * 테스트 환경인지 확인합니다.
 * @returns {boolean} 테스트 환경 여부
 */
export function isTest() {
  return process.env.NODE_ENV === 'test';
}

/**
 * SSR(Server-Side Rendering) 중인지 확인합니다.
 * Next.js에서 서버 사이드 렌더링 중일 때 true를 반환합니다.
 * @returns {boolean} SSR 여부
 */
export function isSSR() {
  return isServer() && typeof global !== 'undefined';
}

/**
 * CSR(Client-Side Rendering) 중인지 확인합니다.
 * 브라우저에서 하이드레이션 완료 후 true를 반환합니다.
 * @returns {boolean} CSR 여부
 */
export function isCSR() {
  return isBrowser() && typeof document !== 'undefined';
}

/**
 * Next.js 개발 서버에서 실행 중인지 확인합니다.
 * @returns {boolean} Next.js 개발 서버 여부
 */
export function isNextDev() {
  return isDevelopment() && typeof global !== 'undefined' && global.__NEXT_DATA__;
}

/**
 * 현재 환경을 문자열로 반환합니다.
 * @returns {string} 환경 이름 (production, development, local, test 등)
 */
export function getEnvironment() {
  return process.env.NODE_ENV || 'development';
}

/**
 * 디버그 모드가 활성화되어 있는지 확인합니다.
 * @returns {boolean} 디버그 모드 여부
 * @example
 * if (isDebugMode()) {
 *   console.log('API 요청:', requestData);
 *   // 상세 로깅, 개발자 도구 표시 등
 * }
 */
export function isDebugMode() {
  return isDevelopment() || process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';
}

/**
 * 플랫폼 정보를 반환합니다.
 * @returns {Object} 플랫폼 정보
 */
export function getPlatformInfo() {
  const info = {
    isBrowser: isBrowser(),
    isServer: isServer(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    environment: getEnvironment()
  };

  if (isBrowser()) {
    info.userAgent = navigator.userAgent;
    info.platform = navigator.platform;
  }

  if (isServer()) {
    info.nodeVersion = process.version;
    info.platform = process.platform;
  }

  return info;
}

/**
 * 브라우저 전용 코드를 실행합니다.
 * @param {Function} fn - 브라우저에서 실행할 함수
 * @param {Function} fallback - 서버에서 실행할 대체 함수 (선택)
 * @returns {any} 함수 실행 결과
 */
export function runInBrowser(fn, fallback = () => undefined) {
  return isBrowser() ? fn() : fallback();
}

/**
 * 서버 전용 코드를 실행합니다.
 * @param {Function} fn - 서버에서 실행할 함수
 * @param {Function} fallback - 브라우저에서 실행할 대체 함수 (선택)
 * @returns {any} 함수 실행 결과
 */
export function runInServer(fn, fallback = () => undefined) {
  return isServer() ? fn() : fallback();
}

/**
 * 개발 환경에서 코드를 실행합니다.
 * @param {Function} fn - 개발 환경에서 실행할 함수
 * @returns {any} 함수 실행 결과 또는 undefined
 * @example
 * runInDevelopment(() => {
 *   console.log('개발 전용 로깅');
 *   window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
 * });
 */
export function runInDevelopment(fn) {
  return isDevelopment() ? fn() : undefined;
}

/**
 * 프로덕션 환경에서 코드를 실행합니다.
 * @param {Function} fn - 프로덕션 환경에서 실행할 함수
 * @returns {any} 함수 실행 결과 또는 undefined
 * @example
 * runInProduction(() => {
 *   // 에러 추적 서비스 초기화
 *   Sentry.init({ dsn: process.env.SENTRY_DSN });
 *   // 성능 모니터링 활성화
 * });
 */
export function runInProduction(fn) {
  return isProduction() ? fn() : undefined;
}

/**
 * 환경변수 값을 가져옵니다 (클라이언트 사이드에서는 NEXT_PUBLIC_ 접두사 필요).
 * @param {string} key - 환경변수 키
 * @param {string} defaultValue - 기본값 (선택적)
 * @returns {string|undefined} 환경변수 값 또는 기본값
 * @example
 * // 서버에서만 접근 가능
 * const dbUrl = getEnvVar('DATABASE_URL', 'localhost:5432');
 *
 * // 브라우저에서도 접근 가능 (NEXT_PUBLIC_ 접두사 필요)
 * const apiUrl = getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000');
 */
export function getEnvVar(key, defaultValue) {
  return process.env[key] || defaultValue;
}

/**
 * 클라이언트에서 접근 가능한 환경변수를 가져옵니다.
 * @param {string} key - 환경변수 키 (NEXT_PUBLIC_ 접두사 자동 추가)
 * @param {string} defaultValue - 기본값 (선택적)
 * @returns {string|undefined} 환경변수 값 또는 기본값
 * @example
 * // 둘 다 동일하게 동작 (자동으로 NEXT_PUBLIC_ 접두사 추가)
 * const apiUrl = getPublicEnvVar('API_URL', 'http://localhost:3000');
 * const sameUrl = getPublicEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000');
 */
export function getPublicEnvVar(key, defaultValue) {
  const fullKey = key.startsWith('NEXT_PUBLIC_') ? key : `NEXT_PUBLIC_${key}`;
  return process.env[fullKey] || defaultValue;
}

/**
 * 현재 실행 중인 Node.js 버전을 확인합니다.
 * @returns {string|null} Node.js 버전 (브라우저에서는 null)
 */
export function getNodeVersion() {
  return isServer() ? process.version : null;
}

/**
 * 모바일 브라우저인지 확인합니다.
 * @returns {boolean} 모바일 브라우저 여부
 * @example
 * if (isMobile()) {
 *   // 모바일 전용 UI 로직
 *   document.body.classList.add('mobile-layout');
 * } else {
 *   // 데스크톱 UI 로직
 *   document.body.classList.add('desktop-layout');
 * }
 */
export function isMobile() {
  return runInBrowser(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, false);
}

export default {
  isBrowser,
  isServer,
  isProduction,
  isDevelopment,
  isLocal,
  isTest,
  isSSR,
  isCSR,
  isNextDev,
  getEnvironment,
  isDebugMode,
  getPlatformInfo,
  runInBrowser,
  runInServer,
  runInDevelopment,
  runInProduction,
  getEnvVar,
  getPublicEnvVar,
  getNodeVersion,
  isMobile
};
