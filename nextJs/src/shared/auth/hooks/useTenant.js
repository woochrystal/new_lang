/*
 * path           : src/shared/auth/useTenant.js
 * fileName       : useTenant
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : 현재 테넌트 정보 관리 및 검증
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 */

import { useTenantStore } from '@/shared/store';

import { useAuth } from './useAuth';

/**
 * 테넌트 컨텍스트를 사용하기 위한 훅
 * @returns {{
 *   tenant: import('@/shared/model/tenantStore').Tenant | null,
 *   tenantId: string | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   isValidTenant: boolean,
 *   isTenantMatches: boolean,
 *   tenantName: string,
 *   tenantPath: string,
 *   loadTenant: Function,
 *   switchTenant: Function
 * }}
 */
export const useTenant = () => {
  const { currentTenant, tenantPath, isLoading, error } = useTenantStore();
  const { user } = useAuth();

  return {
    // 상태
    tenant: currentTenant,
    tenantId: currentTenant?.id || null,
    isLoading,
    error,

    // 검증
    isValidTenant: !!currentTenant?.id,
    isTenantMatches: user?.tenantId === currentTenant?.id,

    // 정보
    tenantName: currentTenant?.name || '',
    tenantPath: tenantPath || '',

    // 액션 (store에 위임)
    fetchAndSetTenant: useTenantStore.getState().fetchAndSetTenant
  };
};
