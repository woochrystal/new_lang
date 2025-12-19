'use client';

/**
 * /[tenant] 루트 경로 → /dashboard 자동 리다이렉트
 * 사용자가 /[tenant] (예: /company1) 로 접속하면 대시보드로 이동합니다.
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { useAuth } from '@/shared/auth';
import { useTenantStore } from '@/shared/store';
import { Loading } from '@/shared/component';

/**
 * /[tenant] 루트 경로 → 로그인 상태에 따라 분기
 *
 * 동작 흐름:
 * 1. 테넌트 정보 설정 (tenantStore에 저장)
 * 2. 로그인 상태 확인
 * 3. 분기:
 *    - 로그인됨 → /dashboard로 리다이렉트
 *    - 로그인 안됨 → /{tenant}/login으로 리다이렉트 (테넌트 정보 유지!)
 *
 * 사용자 입력 보존:
 * - 사용자가 /pentas 입력 → 로그인 안됨 → /pentas/login으로 이동
 * - 테넌트 정보가 손실되지 않음
 */
export default function TenantRootPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const params = useParams(); // useParams 훅 사용
  const { tenant } = params;

  const { hasValidTokens } = useAuth();
  const fetchAndSetTenant = useTenantStore((state) => state.fetchAndSetTenant);

  useEffect(() => {
    async function initialize() {
      try {
        // 1. 테넌트 정보 설정
        const result = await fetchAndSetTenant(tenant);

        if (!result.success) {
          // 테넌트 정보 조회 실패
          console.error('테넌트 정보 조회 실패:', result.error);
          router.replace('/');
          return;
        }

        // 2. 로그인 상태 확인 후 분기
        if (hasValidTokens) {
          // 로그인됨 → 대시보드로
          router.replace('/dashboard');
        } else {
          // 로그인 안됨 → 테넌트 로그인 페이지로 (테넌트 정보 유지!)
          router.replace(`/${tenant}/login`);
        }
      } catch (error) {
        console.error('[TenantRootPage] 초기화 실패:', error);
        router.replace('/');
      } finally {
        setIsProcessing(false);
      }
    }

    if (tenant) {
      initialize();
    }
  }, [tenant, router, fetchAndSetTenant, hasValidTokens]);

  // 처리 중일 때 로딩 화면 표시
  return <Loading message="로그인 확인 중..." size="large" fullscreen={true} />;
}
