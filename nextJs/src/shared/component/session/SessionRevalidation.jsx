'use client';

import { useEffect } from 'react';
import { useAuth } from '@/shared/auth';
import { useAuthStore, useAlertStore, useBlockingErrorStore } from '@/shared/store';
import { useTokenStore } from '@/shared/store';
import { LoggerFactory } from '@/shared/lib';
import { ERROR_CODES, ERROR_MESSAGES, ERROR_TITLES } from '@/shared/api/constants';

const logger = LoggerFactory.getLogger('SessionRevalidation');

export function SessionRevalidation() {
  const { user } = useAuth();

  // 1. 초기 프로필 로드 (앱 시작 시 한 번만 실행)
  useEffect(() => {
    const { initialLoadAttempted, setInitialLoadAttempted } = useAuthStore.getState();
    const hasValidTokens = useTokenStore.getState().hasValidTokensAfterHydration();

    // 초기 로딩: 토큰O, 유저X, 첫 시도일 때만 프로필 로드
    if (!user && hasValidTokens && !initialLoadAttempted) {
      // 로드 시도 플래그를 즉시 true로 설정하여 중복 실행 방지
      setInitialLoadAttempted(true);
      logger.info('[SessionRevalidation] Initial profile load attempt...');

      useAuthStore
        .getState()
        .loadProfile()
        .then(() => {
          logger.info('[SessionRevalidation] Initial profile load completed');
        })
        .catch((error) => {
          logger.warn('[SessionRevalidation] Initial profile load failed:', error);

          // 네트워크 오류: BlockingError 표시 + 재시도
          if (error?.code === ERROR_CODES.NETWORK_ERROR) {
            useBlockingErrorStore.getState().showNetworkError(ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR], () => {
              useAuthStore.getState().loadProfile();
            });
          }
          // 다른 오류: 조용히 처리 (로그만)
        });
    }
  }, []); // 의존성 없음: 마운트 시 1회만 실행

  // 2. 로그인 후 세션 재검증 (user 변경 시 실행)
  useEffect(() => {
    // 로그인하지 않았으면 재검증 불필요
    if (!user) {
      return;
    }

    // 재검증 실패 카운트 추적 (3회 이상 실패 시 Alert)
    let tabFailedCount = 0;
    let periodicFailedCount = 0;
    const MAX_SILENT_RETRIES = 2;

    // debounce 유틸리티: 빠른 탭 전환 시 마지막 복귀만 재검증하도록 함
    const createDebouncedVisibilityHandler = () => {
      let timeoutId = null;

      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (document.visibilityState === 'visible') {
            // 로그아웃 진행 중이면 재검증 스킵
            const { isLoggingOut } = useAuthStore.getState();
            if (isLoggingOut) {
              logger.debug('[SessionRevalidation] 로그아웃 진행 중, 탭 재검증 우회');
              return;
            }
            logger.debug('[SessionRevalidation] Tab visible - reloading profile (debounced)');
            useAuthStore
              .getState()
              .loadProfile()
              .then(() => {
                tabFailedCount = 0;
              })
              .catch((error) => {
                tabFailedCount++;
                logger.warn(`[SessionRevalidation] Tab revalidation failed (${tabFailedCount}회):`, error);

                // 3회 연속 실패 시에만 Alert 표시
                if (tabFailedCount > MAX_SILENT_RETRIES && error?.code === ERROR_CODES.NETWORK_ERROR) {
                  useAlertStore.getState().showError({
                    title: ERROR_TITLES[ERROR_CODES.NETWORK_ERROR],
                    message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
                    confirmText: '다시 시도',
                    onConfirm: () => {
                      tabFailedCount = 0;
                      useAuthStore.getState().loadProfile();
                    }
                  });
                }
              });
          }
        }, 300); // 300ms 디바운스
      };
    };

    // 2-1. 다른 탭에서 돌아오면 즉시 프로필 새로고침
    // (탭 전환하는 동안 권한이 변경되었을 수 있음)
    const onVisibilityChange = createDebouncedVisibilityHandler();

    document.addEventListener('visibilitychange', onVisibilityChange);

    // 2-2. 일정 시간마다 자동으로 프로필 재검증
    const validationMinutes = parseInt(process.env.NEXT_PUBLIC_SESSION_REVALIDATION_MINUTES, 10) || 30;
    const revalidationInterval = setInterval(
      () => {
        // 로그아웃 진행 중이면 주기적 재검증 스킵
        const { isLoggingOut } = useAuthStore.getState();
        if (isLoggingOut) {
          logger.debug('[SessionRevalidation] 로그아웃 진행 중, 주기적 재검증 건너뜀');
          return;
        }
        logger.debug(`[SessionRevalidation] 주기적 재검증 (${validationMinutes}분 주기)`);
        useAuthStore
          .getState()
          .loadProfile()
          .then(() => {
            periodicFailedCount = 0;
          })
          .catch((error) => {
            periodicFailedCount++;
            logger.warn(`[SessionRevalidation] Periodic revalidation failed (${periodicFailedCount}회):`, error);

            // 3회 연속 실패 시에만 Alert 표시
            if (periodicFailedCount > MAX_SILENT_RETRIES && error?.code === ERROR_CODES.NETWORK_ERROR) {
              useAlertStore.getState().showError({
                title: ERROR_TITLES[ERROR_CODES.NETWORK_ERROR],
                message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
                confirmText: '다시 시도',
                onConfirm: () => {
                  periodicFailedCount = 0;
                  useAuthStore.getState().loadProfile();
                }
              });
            }
          });
      },
      validationMinutes * 60 * 1000
    );

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(revalidationInterval);
    };
  }, [user]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
