/*
 * 변경 이력:
 * 2025-11-11: TenantValidator 적용 (테넌트 검증 로직 중앙화)
 */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { isMultiTenantMode, redirectToLogin } from '@/shared/lib';
import { useAuth, useTenant, tenantValidator } from '@/shared/auth';
import { Loading, AccessDenied } from '@/shared/component';

/**
 * 테넌트 컨텍스트를 확인하고 유효하지 않은 접근을 차단하는 가드 컴포넌트
 *
 * 멀티테넌트 모드에서만 테넌트 검증 수행
 * 단일 테넌트 모드에서는 children 통과
 *
 * 검증 순서:
 * 1. 로딩: 테넌트 정보 로드 중
 * 2. 테넌트 없음: 루트로 리다이렉트
 * 3. 로그인하지 않음: children 통과 (RouteGuard가 인증 처리)
 * 4. 테넌트 불일치: 강제 로그아웃 + 로그인 페이지로 리다이렉트
 * 5. 에러 발생: AccessDenied 페이지 표시
 * 6. 테넌트 유효: children 통과
 *
 * @component
 * @example
 * export default function TenantLayout({ children }) {
 *   return (
 *     <TenantGuard>
 *       {children}
 *     </TenantGuard>
 *   );
 * }
 */
export const TenantGuard = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { tenant, isLoading, error } = useTenant();
  const [mounted, setMounted] = React.useState(false);

  // SSR Hydration 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  // 단일 테넌트 모드: TenantGuard 불필요
  if (!isMultiTenantMode()) {
    return <>{children}</>;
  }

  // 서버 렌더 단계: 로딩만 표시
  if (!mounted) {
    return <Loading message="로딩 중..." />;
  }

  // 1. 테넌트 정보 로드 중
  if (isLoading) {
    return <Loading message="테넌트 정보 확인 중..." />;
  }

  // 2. 로그인 안 하고 테넌트도 없으면 RouteGuard에서 처리하도록 진행
  if (!user && !tenant?.id) {
    return <>{children}</>;
  }

  // 3. 테넌트가 없으면 홈으로 리다이렉트 (로그인된 경우만)
  if (!tenant?.id) {
    console.warn('[TenantGuard] No valid tenant, redirecting to home');
    router.push('/');
    return <Loading message="로딩 중..." />;
  }

  // 4. 로그인 안 했으면 RouteGuard가 처리하니까 그냥 진행
  if (!user) {
    return <>{children}</>;
  }

  // 4. 사용자의 실제 테넌트와 현재 페이지 테넌트가 일치하는지 확인
  const tenantValidationResult = tenantValidator.validate(user, tenant);

  if (!tenantValidationResult.valid) {
    console.error('[TenantGuard] Tenant validation failed:', {
      reason: tenantValidationResult.reason,
      message: tenantValidationResult.message,
      userTenant: user.tenantId,
      storeTenant: tenant.id
    });

    // 불일치 시 로그아웃
    logout();
    redirectToLogin(router.asPath);

    return <AccessDenied title="테넌트 정보 오류" message={tenantValidationResult.message} />;
  }

  // 5. 테넌트 로드 중 에러 발생
  if (error) {
    return <AccessDenied title="테넌트 조회 오류" message={error} />;
  }

  // 6. 모든 검증 통과, 렌더링
  return <>{children}</>;
};
