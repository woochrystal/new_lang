/**
 * @fileoverview UI 요소 권한 기반 조건부 렌더링 가드
 * @description 메뉴 항목, 버튼 등 UI 요소의 권한별 표시/숨김 처리 (리다이렉트 없음)
 */

'use client';

import { useAuth } from '@/shared/auth';
import { usePermissions, shouldBypassAuth, createDevUser, checkUserPermissions } from '@/shared/auth/permissionService';

/**
 * UI 요소 조건부 렌더링 가드 컴포넌트
 * - 권한이 있을 때만 렌더링
 * - 메뉴 항목, 버튼, 링크 등 UI 요소에 사용
 * - 성능 최적화: 불필요한 DOM 렌더링 방지
 *
 * ⚠️ 이 컴포넌트는 이미 인증된 사용자를 대상으로 권한만 체크합니다.
 *     미인증 상태에서는 RenderGuard를 사용하지 마세요.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 권한이 있을 때 렌더링할 컴포넌트
 * @param {string[]} [props.requiredPermissions=[]] - 필요한 권한 배열 (예: ['admin.*', 'vacation.read'])
 * @param {React.ReactNode} [props.fallback=null] - 권한 없을 때 대체 렌더링할 컴포넌트
 * @returns {React.ReactNode|null}
 */
export const RenderGuard = ({ children, requiredPermissions = [], fallback = null }) => {
  const { user } = useAuth();
  const { hasAllPermissions } = usePermissions();

  // 개발 환경 우회 체크
  if (shouldBypassAuth()) {
    const devUser = createDevUser();
    const hasRequiredPermissions = checkUserPermissions(devUser, requiredPermissions);
    return hasRequiredPermissions ? children : fallback;
  }

  // 인증되지 않은 사용자 - 권한 체크 불가능
  if (!user) {
    return fallback;
  }

  // 권한 검증
  const hasRequiredPermissions = requiredPermissions.length === 0 ? true : hasAllPermissions(requiredPermissions);

  return hasRequiredPermissions ? children : fallback;
};
