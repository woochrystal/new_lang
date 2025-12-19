/*
 * path           : src/shared/auth/TenantValidator.js
 * fileName       : TenantValidator
 * author         : changhyeon
 * date           : 25. 11. 10.
 * description    : 테넌트 검증 로직 통합 서비스
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 10.       changhyeon       최초 생성
 */

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('TenantValidator');

/**
 * 테넌트 검증 서비스
 *
 * authStore.loadProfile(), TenantGuard 등 여러 곳에서 산재된 테넌트 검증 로직을
 * 하나의 서비스로 통합하여 일관성을 보장합니다.
 *
 * 검증 규칙:
 * 1. 저장된 테넌트 정보가 없으면 TENANT_NOT_SET
 * 2. 사용자 소속 테넌트와 현재 테넌트가 불일치하면 TENANT_MISMATCH
 * 3. 그 외 모든 경우는 VALID
 */
class TenantValidator {
  /**
   * 테넌트 검증
   *
   * @param {Object} user - 사용자 정보 (user.tenantId 포함)
   * @param {Object} tenant - 테넌트 정보 (tenant.id 포함)
   * @returns {Object} 검증 결과
   * @example
   * const result = tenantValidator.validate(user, tenant);
   * if (!result.valid) {
   *   tenantValidator.onValidationFailed(result);
   * }
   */
  validate(user, tenant) {
    // 1. 저장된 테넌트 정보 확인 (필수)
    if (!tenant?.id) {
      return {
        valid: false,
        reason: 'TENANT_NOT_SET',
        message: '테넌트 정보가 설정되지 않았습니다.'
      };
    }

    // 2. 사용자가 있는 경우만 테넌트 불일치 검증
    // (로그인 전에는 user가 null이므로 검증 스킵)
    if (user) {
      const userTenantIdStr = String(user.tenantId);
      const storeTenantIdStr = String(tenant.id);

      if (userTenantIdStr !== storeTenantIdStr) {
        return {
          valid: false,
          reason: 'TENANT_MISMATCH',
          message: '테넌트 정보가 일치하지 않습니다.',
          details: {
            userTenant: user.tenantId,
            storeTenant: tenant.id
          }
        };
      }
    }

    // 3. 모든 검증 통과
    return { valid: true };
  }

  /**
   * 검증 실패 처리
   *
   * 강제 로그아웃 및 에러 알림을 수행합니다.
   *
   * @param {Object} result - validate() 반환 결과
   */
  async onValidationFailed(result) {
    logger.error('[TenantValidator] Validation failed:', {
      reason: result.reason,
      message: result.message,
      details: result.details
    });

    // 강제 로그아웃 (지연 import로 순환 참조 방지)
    const { logoutService } = await import('./LogoutService');
    logoutService.logout();

    // 에러 알림
    const { useAlertStore } = await import('@/shared/store');
    useAlertStore.getState().showError({
      title: '테넌트 정보 오류',
      message: result.message
    });
  }

  /**
   * 에러 객체로 반환하기 위한 헬퍼
   *
   * @param {Object} result - validate() 반환 결과
   * @returns {Error} 에러 객체
   */
  createError(result) {
    const error = new Error(result.reason);
    error.code = result.reason;
    error.message = result.message;
    error.details = result.details;
    error.status = 403;
    return error;
  }
}

// 싱글톤 인스턴스
export const tenantValidator = new TenantValidator();
