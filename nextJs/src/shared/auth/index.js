/*
 * path           : src/shared/auth/index.js
 * fileName       : index
 * author         : changhyeon
 * date           : 25. 09. 12.
 * description    : 인증 모듈 공개 API export
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 09. 12.       changhyeon       최초 생성
 * 25. 09. 12.       changhyeon       에러 메시지 처리 및 로그인, 권한관리 기능 추가
 * 25. 11. 11.       changhyeon       tokenService export 제거 (tokenStore 대체)
 * 25. 11. 11.       changhyeon       인증 관련 파일들 하위 폴더로 재구성
 */

// ============================================================================
// 공개 API - 메인 인터페이스
// ============================================================================

// 메인 훅 - 대부분의 인증 로직 처리
export { useAuth } from './hooks/useAuth';

// API 서비스 - 직접 API 호출이 필요한 경우
export { authApi } from './authApi';

// ============================================================================
// 고급 API - 특수한 경우나 커스텀 구현 시 사용
// ============================================================================

// Zustand 스토어 - 커스텀 훅 만들거나 직접 제어할 때
export { useAuthStore } from '@/shared/store';

// 개발 모드 - BYPASS_AUTH 환경 설정
export { shouldBypassAuth, shouldShowDevAlert, createDevUser } from './utils/devMode';

// 훅
export { useTenant } from './hooks/useTenant';
export { useMenu } from './hooks/useMenu';

// ============================================================================
// 내부 구현 - 라이브러리 개발자용 (일반적으로 사용하지 않음)
// ============================================================================

// 토큰 관리 스토어 (Zustand, localStorage 기반)
export { useTokenStore } from '@/shared/store';

// 토큰 갱신 큐 (동시성 제어, concurrent 요청 관리)
export { TokenRefreshQueue } from './services/TokenRefreshQueue';

// 탭 간 로그아웃 동기화 (BroadcastChannel / localStorage)
export { initLogoutSync, broadcastLogout, cleanupLogoutSync, initLogoutSyncFallback } from './utils/logoutSync';

// 로그아웃 서비스 (중앙 집중식 로그아웃 처리)
export { logoutService } from './services/LogoutService';

// 테넌트 검증 서비스 (테넌트 검증 로직 통합)
export { tenantValidator } from './services/TenantValidator';
