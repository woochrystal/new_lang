/*
 * 변경 이력:
 * 2025-11-11: ABAC 마이그레이션 - check 함수 기반으로 전환 (requiredPermissions 제거)
 */
'use client';

import { useAuth } from '@/shared/auth';

/**
 * UI 요소 조건부 렌더링 가드 컴포넌트
 * - check 함수 결과가 true일 때만 children을 렌더링합니다.
 * - useApi의 has() 함수와 함께 사용하여 리소스별 행동 권한을 제어합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 조건이 true일 때 렌더링할 컴포넌트
 * @param {Function} props.check - 렌더링 조건을 반환하는 함수. 예: () => can('edit')
 * @param {React.ReactNode} [props.fallback=null] - 조건이 false일 때 대체 렌더링할 컴포넌트
 * @returns {React.ReactNode|null}
 */
const RenderGuard = ({ children, check, fallback = null }) => {
  const { user } = useAuth();

  // 인증되지 않은 사용자는 어떤 권한도 가질 수 없으므로 항상 fallback 렌더링
  if (!user) {
    return fallback;
  }

  // check 함수가 제공되지 않았거나, 함수가 아니거나, 실행 결과가 false이면 fallback 렌더링
  if (!check || typeof check !== 'function' || !check()) {
    return fallback;
  }

  // 모든 조건을 통과하면 children 렌더링
  return children;
};

export default RenderGuard;
