/*
 * path           : src/shared/lib/index.js
 * fileName       : index (lib)
 * author         : changhyeon
 * date           : 25. 10. 22.
 * description    : 프로젝트 전역 유틸리티 모듈 진입점 (로깅, 라우팅, 환경, 문자열 등)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 22.       changhyeon       최초 생성
 * 25. 11. 10.       changhyeon       menuUtils export 제거 (ABAC 마이그레이션)
 * 25. 11. 11.       changhyeon       파일 헤더 추가
 */

// ============================================================================
// 로깅
// ============================================================================

// 프로젝트 전역 로거 팩토리
export { LoggerFactory, Logger, LoggingContext } from './logger';

// ============================================================================
// 라우팅 & 테넌트
// ============================================================================

// 라우팅 유틸리티
export {
  getTenantMode,
  getTenantId,
  createDynamicPath,
  getLoginPath,
  redirectToDashboard,
  redirectToLogin,
  isMultiTenantMode,
  isLoginPage
} from './routing';

// ============================================================================
// 환경 변수 & 런타임 감지
// ============================================================================

// 환경 변수 유틸리티
export {
  getEnvVar,
  getPublicEnvVar,
  getEnvironment,
  isDevelopment,
  isProduction,
  isTest,
  isLocal,
  isServer,
  isBrowser,
  isCSR,
  isNextDev,
  isDebugMode,
  isMobile,
  runInServer,
  runInBrowser,
  runInDevelopment,
  runInProduction,
  getNodeVersion,
  getPlatformInfo
} from './envUtils';

// ============================================================================
// 문자열 유틸리티
// ============================================================================

// 문자열 처리 유틸리티
export {
  capitalize,
  titleCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  truncate,
  trim,
  isEmpty,
  isNotEmpty,
  isNumeric,
  isValidEmail,
  addCommas,
  stripHtml,
  formatTemplate,
  stringify,
  stringifyPick,
  stringifySecure,
  simpleHash
} from './stringUtils';
