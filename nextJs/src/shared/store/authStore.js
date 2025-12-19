/*
 * path           : src/shared/store/authStore.js
 * fileName       : authStore
 * author         : changhyeon
 * date           : 25. 11. 07.
 * description    : 사용자 로그인/로그아웃 및 프로필 관리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 22.       changhyeon       최초 생성
 * 25. 10. 22.       changhyeon       로그인 및 인증 401오류 발생시 오류처리 개선
 * 25. 10. 24.       changhyeon       api 클라이언트 사용시 try-catch를 사용하지 않도록 수정
 * 25. 10. 24.       changhyeon       User객체에 대해 백엔드 응답 객체를 사용하도록 수정
 * 25. 11. 03.       changhyeon       권한 및 사용자정보 오버라이딩 이슈 해결
 * 25. 11. 11.       changhyeon       loadProfile Promise를 Zustand 내부 상태로 이동
 * 25. 11. 11.       changhyeon       LogoutService 적용으로 clearUiStateForLogout() 제거, TenantValidator 적용, loadProfile 중복 호출 방지
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { logoutService } from '@/shared/auth/services/LogoutService';
import { tenantValidator } from '@/shared/auth/services/TenantValidator';
import { initLogoutSync, initLogoutSyncFallback } from '@/shared/auth/utils/logoutSync';
import { LoggerFactory, getLoginPath } from '@/shared/lib';
import { useTenantStore, useAlertStore, useTokenStore } from '@/shared/store';

// 로거 인스턴스 생성
const logger = LoggerFactory.getLogger('AuthStore');

/**
 * 통합 인증 & 토큰 관리 Store
 */
export const useAuthStore = create(
  immer((set, get) => ({
    // 사용자 상태
    user: null,
    isLoading: false,
    isLoggingOut: false, // 로그아웃 진행 상태 추가
    initialLoadAttempted: false, // 초기 프로필 로드 시도 여부
    _loadProfilePromise: null, // loadProfile() 중복 호출 방지 (내부 상태)

    // 로그인 후 리다이렉트 URL
    returnUrl: null,
    setReturnUrl: (url) => set({ returnUrl: url }),
    clearReturnUrl: () => set({ returnUrl: null }),

    // 초기 프로필 로드 시도 상태 변경
    setInitialLoadAttempted: (attempted) => set({ initialLoadAttempted: attempted }),

    // 초기화
    initialize: () => {
      // tokenStore에서 localStorage 복원을 처리하므로 여기서는 특별한 작업 불필요
      if (typeof window === 'undefined') {
        return;
      }
    },

    // 인증 비즈니스 로직
    login: async (credentials) => {
      set((state) => {
        state.isLoading = true;
      });

      const { authApi } = await import('@/shared/auth/authApi');
      const { data, error } = await authApi.login(credentials);

      if (error) {
        set((state) => {
          state.user = null;
          state.isLoading = false;
        });

        // GlobalErrorAlert에 에러 표시
        useAlertStore.getState().showError({
          title: '로그인 오류',
          message: error.message || '로그인에 실패했습니다.',
          timestamp: error.timestamp
        });

        return { data: null, error };
      }

      // 토큰 저장
      useTokenStore
        .getState()
        .setTokens(data.accessToken, data.refreshToken, data.expiresIn, data.refreshExpiresIn || 7 * 24 * 60 * 60);

      // 프로필 + 메뉴 로드
      try {
        await get().loadProfile();
      } catch (error) {
        logger.error('[Auth] 프로필 로드 실패:', error);
        set((state) => {
          state.isLoading = false;
        });
        return { data: null, error };
      }

      try {
        const { useMenuStore } = await import('@/shared/store');
        await useMenuStore.getState().loadMenuTree();
      } catch (error) {
        logger.error('[Auth] 메뉴 로드 실패:', error);
        // 메뉴 로드 실패는 치명적이지 않음 (계속 진행)
        // 사용자에게 경고 알림
        useAlertStore.getState().showError({
          title: '메뉴 로드 실패',
          message: '메뉴 정보를 불러오지 못했습니다. 일부 기능이 제한될 수 있습니다.'
        });
      }

      set((state) => {
        state.isLoading = false;
      });

      return { data, error: null };
    },

    logout: () => {
      logoutService.logout();
    },

    loadProfile: async () => {
      const { isLoggingOut, _loadProfilePromise, initialLoadAttempted } = get();

      // 로그아웃이 진행 중일 때는 프로필 로드 중단
      if (isLoggingOut) {
        logger.info('[Auth] Logout in progress, skipping profile load.');
        return { data: null, error: { message: 'Logout in progress' } };
      }

      // 중복 호출 방지: 이미 로딩 중이면 기존 Promise 반환
      if (_loadProfilePromise) {
        logger.debug('[Auth] loadProfile() already in progress, waiting for existing promise');
        return _loadProfilePromise;
      }

      // 초기 로드 시도 플래그 설정 (한 번만 실행되도록 보장)
      if (!initialLoadAttempted) {
        set((state) => {
          state.initialLoadAttempted = true;
        });
      }

      // 새 Promise 생성 및 저장
      const profilePromise = (async () => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          const devModeUtils = await import('@/shared/auth/utils/devMode');
          // 백엔드 API 호출 우회
          if (devModeUtils.shouldBypassAuth()) {
            logger.warn('[DEV] 인증 우회: 더미 user 사용');
            // 현재 활성 테넌트의 ID를 전달하여 개발 모드 사용자 생성
            const { currentTenant } = useTenantStore.getState();
            const devUser = devModeUtils.createDevUser(currentTenant?.id || 1);
            set((state) => {
              state.user = devUser;
              state.isLoading = false;
            });
            return { data: devUser, error: null };
          }

          const { authApi } = await import('@/shared/auth/authApi');
          // /api/auth/me에서 사용자 정보 + 권한을 한 번에 가져옴
          const { data, error } = await authApi.getCurrentUser();

          if (error) {
            set((state) => {
              state.user = null;
              state.isLoading = false;
            });
            return { data: null, error };
          }

          // API 호출은 성공했으나 데이터가 없는 엣지 케이스 방어
          if (!data) {
            const noDataError = new Error('사용자 정보를 받아오지 못했습니다.');
            set((state) => {
              state.user = null;
              state.isLoading = false;
            });
            return { data: null, error: noDataError };
          }

          // 테넌트 정보 검증
          const { currentTenant } = useTenantStore.getState();
          const tenantValidationResult = tenantValidator.validate(data, currentTenant);

          if (!tenantValidationResult.valid) {
            await tenantValidator.onValidationFailed(tenantValidationResult);

            set((state) => {
              state.user = null;
              state.isLoading = false;
            });

            return { data: null, error: tenantValidator.createError(tenantValidationResult) };
          }

          // ABAC: 사용자 정보만 저장 (권한은 각 API에서 meta.permissions으로 제공)
          const user = {
            ...data
          };

          // 사용자 정보 임시 저장
          set((state) => {
            state.user = user;
            state.isLoading = false;
          });

          return { data: user, error: null };
        } finally {
          // 중복 호출 방지 해제
          set({ _loadProfilePromise: null });
        }
      })();

      // Promise 저장 및 반환
      set({ _loadProfilePromise: profilePromise });
      return profilePromise;
    },

    // 개발 환경 지원
    setUser: (userData) => {
      set((state) => {
        state.user = userData;
        state.isLoading = false;
        state.error = null;
      });
    },

    // 인증 상태 확인
    isAuthenticated: () => {
      const { user } = get();
      return useTokenStore.getState().hasValidTokens() && user !== null;
    }
  }))
);

// 브라우저 환경에서 자동 초기화
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();

  // 탭 간 로그아웃 동기화 초기화
  initLogoutSync(() => {
    window.location.href = getLoginPath();
  });

  // 구형 브라우저 폴백 (BroadcastChannel 미지원)
  initLogoutSyncFallback(() => {
    window.location.href = getLoginPath();
  });
}
