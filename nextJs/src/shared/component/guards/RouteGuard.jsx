'use client';

import { Children, createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { shouldBypassAuth, useAuth, useAuthStore, useMenu } from '@/shared/auth';
import { LoggerFactory, redirectToLogin } from '@/shared/lib';
import { useAlertStore, useBlockingErrorStore, useTenantStore, useTokenStore } from '@/shared/store';
import { ERROR_CODES, ERROR_MESSAGES } from '@/shared/api/constants';

import { AccessDenied } from '@/shared/component';
import styles from './RouteGuard.module.scss';

const logger = LoggerFactory.getLogger('RouteGuard');

// 중첩된 RouteGuard를 감지하기 위한 Context
const RouteGuardContext = createContext(null);

export const useRouteGuardContext = () => {
  const context = useContext(RouteGuardContext);
  if (!context) {
    throw new Error('RouteGuard compound components must be used within RouteGuard');
  }
  return context;
};

/**
 * 인증/인가 상태 머신을 포함하는 루트 가드 로직
 * 오직 최상위 RouteGuard 인스턴스에 의해서만 실행됩니다.
 */
const RootGuardLogic = ({ children, checkUrl, accessDeniedRedirectTo }) => {
  const AUTH_STATE = {
    IDLE: 'idle',
    CHECKING_TOKEN: 'checking-token',
    LOADING_PROFILE: 'loading-profile',
    CHECKING_PERMISSIONS: 'checking-permissions',
    AUTHORIZED: 'authorized',
    REVALIDATING: 'revalidating',
    UNAUTHORIZED: 'unauthorized',
    ERROR: 'error'
  };

  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState(AUTH_STATE.IDLE);
  const [error, setError] = useState(null);

  // 이전 state 추적 (무한 루프 방지)
  const prevStateRef = useRef(AUTH_STATE.IDLE);

  const { user, isLoading: isAuthLoading } = useAuth();
  const { menuTree, flatMenuMap, isLoading: isMenuLoading } = useMenu();
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

  useEffect(() => {
    const runAuthFlow = async () => {
      try {
        const currentState = state;
        const prevState = prevStateRef.current;
        prevStateRef.current = currentState;

        // 개발 모드: 모든 검증 우회
        if (shouldBypassAuth()) {
          logger.warn('[DEV] 인증 우회 모드: 모든 검증 우회');
          setState(AUTH_STATE.AUTHORIZED);
          return;
        }

        // REVALIDATING 상태에서는 재진입 방지
        if (currentState === AUTH_STATE.REVALIDATING) {
          return;
        }

        // 재검증 조건 체크
        if (currentState === AUTH_STATE.AUTHORIZED && prevState === AUTH_STATE.AUTHORIZED) {
          logger.debug('[RouteGuard] 백그라운드 재검증 시작 (user 변경 감지)');
          setState(AUTH_STATE.REVALIDATING);

          // Step 1: 토큰 재확인
          if (!useTokenStore.getState().hasValidTokensAfterHydration()) {
            logger.info('재검증: 토큰 만료, 로그인 페이지로 이동');

            // prevStateRef를 REVALIDATING으로 설정하여 무한 루프 방지
            prevStateRef.current = AUTH_STATE.REVALIDATING;

            setState(AUTH_STATE.UNAUTHORIZED);
            const { tenantPath } = useTenantStore.getState();
            redirectToLogin(pathname, tenantPath);
            return;
          }

          // Step 2: 권한 재확인
          const urlToCheck = checkUrl || pathname;
          const hasPageAccess = Object.values(flatMenuMap).some((menu) => {
            if (!menu.menuUrl) return false;
            return urlToCheck === menu.menuUrl || urlToCheck.startsWith(menu.menuUrl + '/');
          });

          const isRootPath = urlToCheck === '/';
          if (!hasPageAccess && !isRootPath) {
            logger.warn(`재검증: 페이지 접근 권한 상실 (${urlToCheck})`);

            // prevStateRef를 REVALIDATING으로 설정하여 무한 루프 방지
            prevStateRef.current = AUTH_STATE.REVALIDATING;

            setState(AUTH_STATE.UNAUTHORIZED);
            if (accessDeniedRedirectTo) {
              router.replace(accessDeniedRedirectTo);
            }
            return;
          }

          // 재검증 성공
          logger.debug('[RouteGuard] 백그라운드 재검증 성공');

          // 무한 루프 방지
          prevStateRef.current = AUTH_STATE.REVALIDATING;

          setState(AUTH_STATE.AUTHORIZED);
          return;
        }

        // 로딩 중인 상태(프로필, 메뉴)이거나 로그아웃 진행 중이면 대기 (초기 인증 흐름에서만)
        if (isLoggingOut || isAuthLoading || isMenuLoading) {
          setState(AUTH_STATE.IDLE);
          return;
        }

        // 초기 인증 흐름
        // Step 1: 토큰 확인
        setState(AUTH_STATE.CHECKING_TOKEN);
        if (!useTokenStore.getState().hasValidTokensAfterHydration()) {
          logger.info('유효한 토큰이 없습니다. 로그인 페이지로 이동합니다.');
          setState(AUTH_STATE.UNAUTHORIZED);
          const { tenantPath } = useTenantStore.getState();
          redirectToLogin(pathname, tenantPath);
          return;
        }

        // Step 2: 사용자 프로필 로드 (초기 프로필 로드)
        const { initialLoadAttempted } = useAuthStore.getState();
        if (!user && !initialLoadAttempted) {
          setState(AUTH_STATE.LOADING_PROFILE);

          const { error: profileError } = await useAuthStore.getState().loadProfile();

          if (!profileError) {
            // loadProfile 성공 후 user 상태가 변경되면 이 useEffect가 다시 실행됨
            return;
          } else {
            logger.error('프로필 로드 실패: {}', profileError);

            // 네트워크 오류: BlockingError 표시 + 재시도
            if (profileError.code === ERROR_CODES.NETWORK_ERROR) {
              useBlockingErrorStore.getState().showNetworkError(ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR], () => {
                setState(AUTH_STATE.IDLE);
              });
              return;
            }

            // 다른 오류: ERROR 상태로 전환
            setError(profileError);
            setState(AUTH_STATE.ERROR);
            return;
          }
        }

        // Step 3: 페이지 접근 권한 확인
        setState(AUTH_STATE.CHECKING_PERMISSIONS);
        const urlToCheck = checkUrl || pathname;

        // 메뉴가 아직 로드되지 않았으면 대기
        if (!menuTree) {
          return;
        }

        if (!flatMenuMap || typeof flatMenuMap !== 'object' || Object.keys(flatMenuMap).length === 0) {
          // 메뉴 로드 실패 시: 폴백 메뉴가 이미 설정되어 있음
          // 빈 메뉴인 경우 대시보드만 접근 허용
          const isDashboard = urlToCheck === '/dashboard';

          // 한 번만 경고 표시하도록 플래그 사용
          if (isDashboard) {
            logger.warn('[RouteGuard] 메뉴 정보를 불러오지 못했습니다. 대시보드만 이용 가능합니다.');
            // 사용자 경고 알림
            useAlertStore.getState().showWarning({
              title: '메뉴 로드 실패',
              message: '메뉴 정보를 불러오지 못했습니다. 대시보드만 이용 가능합니다.'
            });
            setState(AUTH_STATE.AUTHORIZED);
            return;
          }

          logger.warn(`메뉴 로드 실패: 대시보드 외 경로 접근 불가 (${urlToCheck})`);
          setState(AUTH_STATE.UNAUTHORIZED);
          return;
        }

        const hasPageAccess = Object.values(flatMenuMap).some((menu) => {
          if (!menu.menuUrl) return false;
          // 정확히 일치하거나, 하위 경로인 경우만 허용
          // 예: /reports는 허용, /reports-archive는 미허용
          return urlToCheck === menu.menuUrl || urlToCheck.startsWith(menu.menuUrl + '/');
        });

        // 루트 경로 처리: 정책 결정 완료 (무조건 허용)
        // 이유: 사용자가 명시적으로 '/'를 요청할 경우 매우 드물며,
        //      providers.jsx에서 <RouteGuard>로 보호되는 영역에서는
        //      루트 경로에 도달할 일이 없음
        // 참고: 로그인 안 한 사용자가 '/'를 접근하면 먼저 토큰 검증 단계에서 걸러짐
        const isRootPath = urlToCheck === '/';
        if (!hasPageAccess && !isRootPath) {
          logger.warn(`페이지 접근 권한 없음: ${urlToCheck}`);
          if (accessDeniedRedirectTo) {
            router.replace(accessDeniedRedirectTo);
          }
          setState(AUTH_STATE.UNAUTHORIZED);
          return;
        }

        // Step 4: 최종 승인
        setState(AUTH_STATE.AUTHORIZED);
      } catch (err) {
        logger.error('인증 흐름 실패: {}', err);
        setError(err);
        setState(AUTH_STATE.ERROR);
      }
    };

    runAuthFlow();
  }, [
    isLoggingOut,
    isAuthLoading,
    isMenuLoading,
    user,
    menuTree,
    flatMenuMap,
    pathname,
    checkUrl,
    router,
    accessDeniedRedirectTo
  ]);

  // --- 렌더링 로직 ---
  const childArray = Children.toArray(children);
  const loadingChild = childArray.find((child) => child.type === Loading) || <div>로그인 확인 중...</div>;
  const fallbackChild = childArray.find((child) => child.type === Fallback) || <AccessDenied />;
  const contentChildren = childArray.filter((child) => child.type !== Loading && child.type !== Fallback);

  const isLoadingState =
    state === AUTH_STATE.IDLE ||
    state === AUTH_STATE.CHECKING_TOKEN ||
    state === AUTH_STATE.LOADING_PROFILE ||
    state === AUTH_STATE.CHECKING_PERMISSIONS;

  if (isLoadingState) {
    return loadingChild;
  }

  // 재검증 중 페이지 컴포넌트 유지 + 오버레이 표시
  if (state === AUTH_STATE.REVALIDATING) {
    return (
      <>
        {contentChildren}
        <div className={styles.routeGuardRevalidationOverlay} role="alert" aria-busy="true" aria-live="polite">
          <div className={styles.overlayContent}>
            <div className={styles.spinner} />
            <p>세션 확인 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (state === AUTH_STATE.UNAUTHORIZED) {
    return fallbackChild;
  }

  if (state === AUTH_STATE.ERROR) {
    // 네트워크 오류는 Alert으로 처리되므로 표시 안 함
    if (error?.code === 'NETWORK_ERROR') {
      return loadingChild;
    }

    return (
      <div className={styles.errorContainer}>
        <h2>인증 처리 중 오류가 발생했습니다</h2>
        <p>{error?.message || '다시 시도해주세요.'}</p>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </div>
    );
  }

  // state === AUTH_STATE.AUTHORIZED
  return <>{contentChildren}</>;
};

const RouteGuardRoot = ({ children, ...props }) => {
  const parentGuard = useContext(RouteGuardContext);
  const isRootGuard = !parentGuard;

  // 최상위 루트 가드일 경우에만 상태 머신 로직을 실행
  if (isRootGuard) {
    return (
      <RouteGuardContext.Provider value={{ isInsideGuard: true }}>
        <RootGuardLogic {...props}>{children}</RootGuardLogic>
      </RouteGuardContext.Provider>
    );
  }

  // 중첩된 자식 가드일 경우, 아무 로직 없이 children만 렌더링
  // 모든 인증/인가는 최상위 루트 가드가 처리
  return <>{children}</>;
};

const Loading = ({ children }) => children;
const Fallback = ({ children }) => children;

/*
 * 변경 이력:
 * 2025-11-11: 메뉴 로드 실패 시 폴백 UI 처리
 *   - 빈 메뉴인 경우 대시보드만 접근 허용
 *   - menuStore에서 FALLBACK_MENU 제공으로 우아한 성능 저하
 * 2025-11-11: AccessDenied standalone prop 제거
 *   - providers.jsx에서 한 곳에서만 사용되므로 standalone prop 제거
 *   - 기본 fallback: <AccessDenied /> (prop 없음)
 */

const RouteGuard = Object.assign(RouteGuardRoot, {
  Loading,
  Fallback
});

export default RouteGuard;
