/**
 * @fileoverview 통합 인증 모듈 메인 엔트리포인트
 * @description 인증 관련 기능 임포트
 *
 * 주요 기능:
 * - 인증 API (로그인, 로그아웃, 토큰 갱신 등)
 * - JWT 토큰 저장/관리 (localStorage 영속성)
 * - 백엔드 제공 expiresIn 기반 만료 검증
 * - SSR 안전성 (typeof window !== 'undefined')
 * - 사용자 정보 관리
 *
 * 사용법:
 * import { useAuth, authApi } from '@/shared/auth'
 * const { login, logout, user, isAuthenticated } = useAuth()
 */

// ============================================================================
// 공개 API - 메인 인터페이스
// ============================================================================

// 메인 훅 - 대부분의 인증 로직 처리
export { useAuth } from './useAuth';

// API 서비스 - 직접 API 호출이 필요한 경우
export { authApi } from './authApi';

// ============================================================================
// 고급 API - 특수한 경우나 커스텀 구현 시 사용
// ============================================================================

// Zustand 스토어 - 커스텀 훅 만들거나 직접 제어할 때
export { useAuthStore } from './authStore';

// 토큰 서비스 - 직접 localStorage 조작하거나 커스텀 토큰 로직 구현시
export { isTokenValid, loadTokensFromStorage, saveTokensToStorage, clearTokensFromStorage } from './tokenService';

// 권한 서비스 -  로우레벨 권한 제어
export {
  shouldBypassAuth,
  createDevUser,
  checkUserPermissions,
  hasFeatureFlag,
  matchWildcardPermission,
  hasWildcardPermission,
  usePermissions
} from './permissionService';
