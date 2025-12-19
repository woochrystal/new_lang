/*
 * path           : src/shared/api/middleware/tenantMismatchHandler.js
 * fileName       : tenantMismatchHandler
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : 테넌트 불일치(403) 감지 시 강제 로그아웃
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 11.       changhyeon       순환 참조 방지 (LogoutService Lazy import)
 */

import { LoggerFactory } from '@/shared/lib';
import { useTokenStore } from '@/shared/store';

import { HTTP_STATUS } from '../constants';

const logger = LoggerFactory.getLogger('TenantMismatchHandler');

/**
 * 테넌트 불일치 (403 + TENANT_MISMATCH) 에러 처리
 *
 * @param {import('axios').AxiosError} error - 에러 객체
 * @param {Function} createReadableError - 사용자 대상 에러 생성 함수
 * @returns {Promise<{data: any, error: Error}> | null} 처리 결과 또는 null (다른 핸들러로 진행)
 *
 * @example
 * const result = handleTenantMismatch(error, createReadableError);
 * if (result) return result;
 */
export const handleTenantMismatch = (error, createReadableError) => {
  // 인증된 사용자가 아닐 경우, 핸들러 우회
  // (비로그인 상태에서 존재하지 않는 테넌트 접근 시 404)
  if (!useTokenStore.getState().hasValidTokens()) {
    return null;
  }

  if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
    const errorData = error.response?.data;

    if (errorData?.code === 'TENANT_MISMATCH') {
      logger.error('[TenantMismatchHandler] 테넌트 불일치 감지:', {
        expected: errorData.expected,
        received: errorData.received
      });

      // 강제 로그아웃 (지연 import로 순환 참조 방지)
      import('@/shared/auth').then(({ logoutService }) => {
        logoutService.logout();
      });

      const readableError = createReadableError(error);
      readableError.message = '테넌트 정보가 일치하지 않습니다. 다시 로그인해주세요.';

      const { config: originalRequest } = error;
      const errorHandler = originalRequest._onError || (() => null);
      const transformedData = errorHandler(readableError);

      if (originalRequest._finally) {
        originalRequest._finally();
      }

      return Promise.resolve({ data: transformedData, error: readableError });
    }
  }

  return null; // 다른 핸들러로 넘김
};
