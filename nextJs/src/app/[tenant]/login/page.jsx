'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, useAuthStore } from '@/shared/auth';
import { useTenantStore, useAlertStore } from '@/shared/store';
import { BrandingSection, LoginForm } from '@/features/groupware/login';
import Footer from '@/shared/ui/Footer/Footer';
import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('TenantLoginPage');

export default function TenantLoginPage() {
  const router = useRouter();
  const { hasValidTokens } = useAuth();
  const params = useParams();
  const tenantId = params?.tenant;

  if (!tenantId) {
    notFound();
  }

  // 이미 로그인된 사용자 리다이렉트
  useEffect(() => {
    if (hasValidTokens) {
      router.replace('/dashboard');
    }
  }, [hasValidTokens, router]);

  // zustand store에서 returnUrl을 읽음
  const returnUrl = useAuthStore((state) => state.returnUrl);
  const setReturnUrl = useAuthStore((state) => state.setReturnUrl);
  const clearReturnUrl = useAuthStore((state) => state.clearReturnUrl);

  // sessionStorage에서 returnUrl을 읽어서 store에 저장 (처음 한 번만)
  useEffect(() => {
    const storedReturnUrl = sessionStorage.getItem('loginReturnUrl');
    if (storedReturnUrl) {
      setReturnUrl(storedReturnUrl);
      sessionStorage.removeItem('loginReturnUrl');
    }
  }, [setReturnUrl]);

  const { currentTenant, isLoading, error, fetchAndSetTenant } = useTenantStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // 테넌트 ID 유효성 검증
  const TENANT_ID_REGEX = /^[a-z0-9-]+$/;
  const isValidFormat = TENANT_ID_REGEX.test(tenantId);

  // 페이지 unmount 시 returnUrl 초기화
  useEffect(() => {
    return () => {
      clearReturnUrl();
    };
  }, [clearReturnUrl]);

  useEffect(() => {
    // 형식 검증 실패하면 초기화만 함
    if (!isValidFormat) {
      setIsInitialized(true);
      return;
    }

    const checkAuthAndTenant = async () => {
      // 테넌트 정보 로드
      const { success, error: tenantError, errorCode } = await fetchAndSetTenant(tenantId);

      if (!success || tenantError) {
        logger.error('[TenantLoginPage] 테넌트 로드 실패: {}', tenantError);

        // 네트워크 오류: 재시도 옵션과 함께 표시
        if (errorCode === 'NETWORK_ERROR') {
          setIsInitialized(true);
          useAlertStore.getState().showError({
            title: '네트워크 오류',
            message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
            confirmText: '다시 시도',
            onConfirm: () => {
              setIsInitialized(false);
              checkAuthAndTenant();
            },
            showCloseButton: false
          });
          return;
        }

        // 실제 404 (테넌트 없음): 렌더링 로직에서 처리하도록 상태 업데이트 후 return
        setIsInitialized(true);
        return;
      }

      // 테넌트 로드 완료 후 초기화
      setIsInitialized(true);
    };

    checkAuthAndTenant();
  }, [tenantId, isValidFormat]);
  // 로딩 중
  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1 flex justify-center items-center p-8">
          <div>
            <div className="text-center p-12">
              <p>로딩 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 유효성 검증 실패 (404)
  if (!isValidFormat) {
    notFound();
  }

  // 테넌트 없음 (404)
  if (error || !currentTenant) {
    notFound();
  }

  // 성공: 테넌트 정보로 렌더링
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 loginBg">
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="flex gap-[160px] max-w-[1200px] w-full">
          <BrandingSection />
          <LoginForm returnUrl={returnUrl} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
