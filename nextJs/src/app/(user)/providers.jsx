'use client';

import React from 'react';
import {
  HydrationGuard,
  RouteGuard,
  TenantGuard,
  Loading,
  AccessDenied,
  SessionRevalidation
} from '@/shared/component';

/**
 * 클라이언트 컴포넌트 프로바이더 및 공통 가드 통합
 *
 * 인증된 사용자를 위한 레이아웃에서 children을 감싸는 컴포넌트입니다.
 * 클라이언트 사이드 프로바이더(Context 등)와 공통 가드(TenantGuard)를 여기에서 관리합니다.
 *
 * @example
 * export default function AuthLayout({ children }) {
 *   return (
 *     <Providers>
 *       {children}
 *     </Providers>
 *   );
 * }
 */
/*
 * 변경 이력:
 * 2025-11-11: RouteGuard 통합
 *   - RouteGuard, Loading, AccessDenied import 추가
 *   - TenantGuard 내부에 RouteGuard 계층 추가
 *   - 모든 (user) 라우트에 자동 메뉴 권한 검증 적용
 *   - 가드 계층: HydrationGuard → SessionRevalidation → TenantGuard → RouteGuard
 */

export function Providers({ children }) {
  return (
    <HydrationGuard>
      <SessionRevalidation />
      <TenantGuard>
        <RouteGuard>
          <RouteGuard.Loading>
            <Loading message="로그인 확인 중..." size="large" fullscreen={true} />
          </RouteGuard.Loading>

          <RouteGuard.Fallback>
            <AccessDenied title="페이지 접근 권한 없음" message="이 페이지에 접근할 수 있는 메뉴 권한이 없습니다." />
          </RouteGuard.Fallback>

          {children}
        </RouteGuard>
      </TenantGuard>
    </HydrationGuard>
  );
}
