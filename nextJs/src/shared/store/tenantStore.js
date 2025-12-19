/*
 * path           : src/shared/store/tenantStore.js
 * fileName       : tenantStore
 * author         : changhyeon
 * date           : 25. 11. 07.
 * description    : 현재 활성 테넌트 정보 저장 및 검증
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 07.       changhyeon       인증 우회시 백엔드 데이터 모킹 처리
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { getMockTenant } from '@/shared/api/mock/mockService';
import { LoggerFactory } from '@/shared/lib/logger';

/**
 * @typedef {object} Tenant
 * @property {string} id - 테넌트 고유 ID (예: '1')
 * @property {string} name - 테넌트 이름 (예: 'ACME Corporation')
 * @property {object} theme - 테넌트별 테마
 * @property {string[]} features - 활성화된 기능
 */

/**
 * @typedef {object} TenantState
 * @property {Tenant | null} currentTenant - 현재 선택된 테넌트 정보
 * @property {string | null} tenantPath - 테넌트 경로 (URL 세그먼트)
 * @property {number} version - localStorage 마이그레이션 버전
 * @property {boolean} isLoading - 정보를 불러오는 중
 * @property {string | null} error - 에러 메시지
 */

/**
 * @typedef {object} TenantActions
 * @property {(tenantPath: string) => Promise<{success: boolean, data?: object, error?: Error}>} fetchAndSetTenant - API에서 테넌트 정보 가져와서 저장
 * @property {() => Promise<void>} loadTenantFromUrl - URL에서 테넌트 ID 읽어서 설정
 * @property {() => string | null} extractTenantFromUrl - URL에서 테넌트 경로 추출
 * @property {() => void} clearTenant - 테넌트 정보 싹 지우기
 */

const initialState = {
  currentTenant: null,
  tenantPath: null,
  version: 2,
  isLoading: true,
  error: null
};

/**
 * 저장된 데이터를 마이그레이션합니다.
 * 구 버전 (version < 2)의 localStorage는 무시하고 클린 상태로 시작합니다.
 */
const tenantStorageMigration = (persistedState) => {
  // 저장된 버전이 없거나 1 이하이면 새로 시작 (기존 구 데이터 무시)
  if (!persistedState || persistedState.version < 2) {
    // eslint-disable-next-line no-console
    console.info('[TenantStore] Clearing old storage (version mismatch). Users need to re-login.');
    return initialState;
  }

  // 버전 2: 최신 형식, 그대로 반환
  return persistedState;
};

export const useTenantStore = create(
  persist(
    immer((set, get) => ({
      ...initialState,

      /**
       * API에서 테넌트 정보를 가져와서 저장합니다.
       * @param {string} tenantPath - 테넌트 경로 또는 ID
       * @returns {Promise<{success: boolean, data?: object, error?: Error}>}
       */
      fetchAndSetTenant: async (tenantPath) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        const { shouldBypassAuth } = await import('@/shared/auth/utils/devMode');

        // BYPASS_AUTH 모드: Mock 데이터 사용
        let data;
        if (shouldBypassAuth()) {
          data = getMockTenant();
        } else {
          const { authApi } = await import('@/shared/auth/authApi');
          const { data: result, error: responseError } = await authApi.getTenantInfo(tenantPath);

          if (responseError || !result) {
            const errorMsg = responseError?.message || '존재하지 않는 테넌트입니다.';
            set((state) => {
              state.isLoading = false;
              state.error = errorMsg;
              state.currentTenant = null;
              state.tenantPath = null;
            });
            LoggerFactory.getLogger('TenantStore').error('[TenantStore] Failed to fetch tenant: {}', errorMsg);
            return { success: false, error: errorMsg, errorCode: responseError?.code };
          }

          data = result;
        }

        // 테넌트 정보 유효성 검사
        if (!data?.id) {
          const errorMsg = '유효하지 않은 테넌트 정보입니다.';
          set((state) => {
            state.isLoading = false;
            state.error = errorMsg;
            state.currentTenant = null;
            state.tenantPath = null;
          });
          LoggerFactory.getLogger('TenantStore').error('[TenantStore] Invalid tenant data: {}', errorMsg);
          return { success: false, error: errorMsg, errorCode: 'VALIDATION_ERROR' };
        }

        // 테넌트 전환 감지 및 로깅
        const previousTenant = get().currentTenant;
        if (previousTenant && previousTenant.id !== data.id) {
          LoggerFactory.getLogger('TenantStore').info(
            '[TenantStore] Tenant switched: {} -> {}',
            previousTenant.id,
            data.id
          );
        }

        set((state) => {
          state.currentTenant = data;
          state.tenantPath = tenantPath;
          state.version = 2; // 버전 업데이트
          state.isLoading = false;
          state.error = null;
        });

        return { success: true, data };
      },

      /**
       * 테넌트 정보를 모두 초기화합니다.
       */
      clearTenant: () => {
        set(initialState);
      }
    })),
    {
      name: 'pentaware-tenant',
      storage: createJSONStorage(() => localStorage),
      version: 2, // zustand persist 버전
      migrate: tenantStorageMigration, // 마이그레이션 함수
      partialize: (state) => ({
        currentTenant: state.currentTenant
          ? {
              id: state.currentTenant.id,
              name: state.currentTenant.name,
              logo: state.currentTenant.logo,
              theme: state.currentTenant.theme,
              loginMessage: state.currentTenant.loginMessage
            }
          : null,
        tenantPath: state.tenantPath,
        version: state.version
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // localStorage 복원 완료, 무조건 로딩 종료
          state.isLoading = false;
        }
      }
    }
  )
);
