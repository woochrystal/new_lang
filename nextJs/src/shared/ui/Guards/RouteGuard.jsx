'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/shared/auth';
import { usePermissions, shouldBypassAuth, setupDevUser, checkUserPermissions } from '@/shared/auth/permissionService';
import { getLoginPath } from '@/shared/lib/routing';
import { AccessDenied } from '@/shared/ui/ErrorPage/AccessDenied';
import { DevModeAlert } from '@/shared/ui/DevMode/DevModeAlert';
import { LoggerFactory } from '@/shared/lib/logger';

// 로거 인스턴스 생성
const logger = LoggerFactory.getLogger('RouteGuard');

/**
 * 페이지 라우트 가드 컴포넌트
 * - 레이아웃에서 사용하여 페이지 전체를 보호
 * - 인증 실패 시 로그인 페이지로 리다이렉트
 * - 권한 실패 시 접근 거부 페이지 표시 또는 리다이렉트
 * - 로딩 상태 관리 및 사용자 프로필 자동 로드
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 보호할 컴포넌트
 * @param {string[]} [props.requiredPermissions=[]] - 필요한 권한 배열
 * @param {string} [props.redirectTo] - 미인증 시 리다이렉트 경로
 * @param {string} [props.accessDeniedRedirectTo] - 권한 부족 시 리다이렉트 경로 (설정하면 리다이렉트, 없으면 페이지 표시)
 * @param {React.ReactNode} [props.fallback] - 로딩 중 표시할 컴포넌트
 * @param {React.ReactNode} [props.accessDenied] - 권한 없음 표시할 컴포넌트
 * @returns {React.ReactNode}
 */
export const RouteGuard = ({
  children,
  requiredPermissions = [],
  redirectTo,
  accessDeniedRedirectTo = null,
  fallback = <div>로그인 확인 중...</div>,
  accessDenied = <AccessDenied />
}) => {
  // 동적 리다이렉트 경로 설정
  const loginPath = redirectTo || getLoginPath();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // 인증 훅
  const { user, isLoading, hasValidTokens, loadProfile, setUser } = useAuth();
  const { hasAllPermissions } = usePermissions();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 개발 환경 인증 우회 체크
        if (shouldBypassAuth()) {
          logger.warn('[DEV] 인증이 우회되었습니다. 운영 환경에서는 NEXT_PUBLIC_BYPASS_AUTH=false로 설정하세요');

          // 인증 우회 시 AuthStore에 더미 사용자 설정
          setupDevUser(setUser);

          setIsChecking(false);
          return;
        }

        // 정상 인증 플로우: 유효한 토큰이 없으면 로그인 페이지로
        if (!hasValidTokens()) {
          logger.info('유효한 토큰이 없습니다. 로그인 페이지로 이동합니다.');
          router.replace(loginPath);
          return;
        }

        // 토큰은 있지만 사용자 정보가 없는 경우
        if (!user) {
          logger.info('사용자 정보 + 권한을 로드합니다. (/api/auth/me)');
          try {
            // loadProfile에서 /api/auth/me를 호출하여 사용자 정보 + 권한을 함께 가져옴
            await loadProfile();
            logger.info('사용자 정보 및 권한 로드 완료');
          } catch (error) {
            logger.error('프로필 로드 실패: {}', error);
            router.replace(loginPath);
            return;
          }
        }

        setIsChecking(false);
      } catch (error) {
        logger.error('인증 확인 실패: {}', error);
        router.replace(loginPath);
      }
    };

    checkAuth();
  }, [router, loginPath]);

  // 인증 확인 중이거나 로딩 중인 경우
  if (isChecking || isLoading) {
    return fallback;
  }

  // 개발 환경 인증 우회가 활성화된 경우
  if (shouldBypassAuth() && user) {
    // 개발 환경에서도 권한 검증 적용
    const hasRequiredPermissions = checkUserPermissions(user, requiredPermissions);

    if (!hasRequiredPermissions) {
      // 권한 부족 시 리다이렉트 경로가 설정되어 있으면 리다이렉트
      if (accessDeniedRedirectTo) {
        router.replace(accessDeniedRedirectTo);
        return null;
      }

      return (
        <>
          <DevModeAlert user={user} hasPermissionIssue={true} requiredPermissions={requiredPermissions} />
          {accessDenied}
        </>
      );
    }

    return (
      <>
        <DevModeAlert user={user} hasPermissionIssue={false} />
        {children}
      </>
    );
  }

  // 정상 인증 플로우: 유효한 토큰이 없으면 리다이렉트 처리
  if (!shouldBypassAuth() && !hasValidTokens()) {
    return null; // 리다이렉트 처리
  }

  // 정상 인증 플로우: 사용자 정보가 없는 경우
  if (!shouldBypassAuth() && !user) {
    return null; // 프로필 로드 또는 리다이렉트 처리
  }

  // 정상 인증 플로우: 권한 검증 (새로운 권한 시스템)
  const hasRequiredPermissions = requiredPermissions.length === 0 ? true : hasAllPermissions(requiredPermissions);

  if (!hasRequiredPermissions) {
    // 권한 부족 시 리다이렉트 경로가 설정되어 있으면 리다이렉트
    if (accessDeniedRedirectTo) {
      router.replace(accessDeniedRedirectTo);
      return null;
    }

    // 리다이렉트 경로가 없으면 접근 거부 페이지 표시
    return accessDenied;
  }

  // 모든 인증 및 권한 검증이 완료된 경우 컴포넌트 렌더링
  return <>{children}</>;
};
