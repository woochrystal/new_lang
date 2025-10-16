/**
 * @fileoverview 권한 관리 서비스 모듈
 * @description 권한 체크 유틸리티 함수들과 개발 환경 설정
 *
 * 주요 기능:
 * - 와일드카드 권한 매칭 ('*.read', 'admin.*' 등 지원)
 * - 개발 환경 권한 우회 기능
 * - 권한 체크 유틸리티 함수들
 *
 * ⚠️ 권한 데이터는 authStore의 user.permissions에서 관리됩니다.
 *
 * 사용법:
 * import { hasWildcardPermission, shouldBypassAuth } from '@/shared/auth/permissionService'
 */

import { LoggerFactory } from '../lib/logger';

// 로거 인스턴스
const logger = LoggerFactory.getLogger('PermissionService');

// ============================================================================
// PERMISSION UTILITIES
// ============================================================================

/**
 * 개발 환경 인증 우회 여부 확인
 * @returns {boolean} 인증을 우회할지 여부
 */
export const shouldBypassAuth = () => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
};

/**
 * DevMode Alert 표시 여부 확인
 * @returns {boolean} DevMode Alert를 표시할지 여부
 */
export const shouldShowDevAlert = () => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.NEXT_PUBLIC_SHOW_DEV_ALERT === 'true';
};

/**
 * 개발용 더미 사용자 정보 생성
 * @returns {Object} 더미 사용자 정보
 */
export const createDevUser = () => ({
  id: process.env.NEXT_PUBLIC_DEV_USER_ID || 'developer',
  name: process.env.NEXT_PUBLIC_DEV_USER_NAME || '개발자',
  role: process.env.NEXT_PUBLIC_DEV_USER_ROLE || 'admin',
  permissions: process.env.NEXT_PUBLIC_DEV_USER_PERMISSIONS?.split(',') || [
    // 와일드카드 권한 예시 - 모든 읽기 권한
    '*.read',

    // 와일드카드 권한 예시 - 특정 모듈의 모든 권한
    'admin.*',
    'profile.*',

    // 구체적인 권한들
    'approval.write',
    'expense.write',
    'member.write',
    'archive.write',
    'task.write',
    'community.write',
    'equipment.write'
  ]
});

/**
 * 개발 환경에서 AuthStore에 더미 사용자 설정
 * @param {Function} setUser - AuthStore의 setUser 함수
 * @returns {Object} 생성된 더미 사용자 정보
 */
export const setupDevUser = (setUser) => {
  const devUser = createDevUser();

  // AuthStore의 user 상태에 직접 설정
  setUser(devUser);

  return devUser;
};

/**
 * 와일드카드 권한 매칭 함수
 * @param {string} userPermission - 사용자가 보유한 권한 (와일드카드 포함 가능)
 * @param {string} requiredPermission - 요구되는 권한
 * @returns {boolean} 권한 매칭 여부
 *
 * @example
 * matchWildcardPermission('*.read', 'approval.read') // true
 * matchWildcardPermission('approval.*', 'approval.write') // true
 * matchWildcardPermission('approval.read', 'approval.read') // true
 * matchWildcardPermission('*.read', 'approval.write') // false
 */
export const matchWildcardPermission = (userPermission, requiredPermission) => {
  // 정확한 매칭
  if (userPermission === requiredPermission) {
    return true;
  }

  // 와일드카드가 없으면 매칭 실패
  if (!userPermission.includes('*')) {
    return false;
  }

  // 점(.)으로 분리하여 각 부분을 비교
  const userParts = userPermission.split('.');
  const requiredParts = requiredPermission.split('.');

  // 부분 개수가 다르면 매칭 실패
  if (userParts.length !== requiredParts.length) {
    return false;
  }

  // 각 부분을 와일드카드와 비교
  return userParts.every((userPart, index) => {
    const requiredPart = requiredParts[index];
    return userPart === '*' || userPart === requiredPart;
  });
};

/**
 * 사용자가 특정 권한을 보유하고 있는지 확인
 * @param {string[]} userPermissions - 사용자 권한 배열
 * @param {string} requiredPermission - 확인할 권한
 * @returns {boolean} 권한 보유 여부
 */
export const hasWildcardPermission = (userPermissions, requiredPermission) => {
  if (!Array.isArray(userPermissions) || !requiredPermission) {
    return false;
  }

  return userPermissions.some((userPermission) => matchWildcardPermission(userPermission, requiredPermission));
};

/**
 * 사용자 권한 체크 함수 (동적 권한 + 와일드카드 지원)
 * @param {Object} user - 사용자 정보
 * @param {string[]} requiredPermissions - 필요한 권한 배열
 * @returns {boolean} 권한 보유 여부
 */
export const checkUserPermissions = (user, requiredPermissions) => {
  if (!user || !Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    return true; // 권한 체크가 필요없는 경우
  }

  // 동적 권한 시스템만 지원
  if (!user.permissions || !Array.isArray(user.permissions)) {
    logger.warn('사용자에게 동적 권한 정보가 없습니다. 권한 체크 실패: {}', user);
    return false;
  }

  // 모든 필요한 권한을 와일드카드 지원으로 확인
  return requiredPermissions.every((requiredPermission) => hasWildcardPermission(user.permissions, requiredPermission));
};

/**
 * 기능 플래그 체크
 * @param {string[]} userFeatures - 사용자 기능 목록
 * @param {string} feature - 확인할 기능
 * @returns {boolean} 기능 사용 가능 여부
 */
export const hasFeatureFlag = (userFeatures, feature) => {
  if (!Array.isArray(userFeatures) || !feature) {
    return false;
  }
  return userFeatures.includes(feature);
};

// ============================================================================
// CONVENIENCE HOOK
// ============================================================================

import { useAuth } from './useAuth';

/**
 * 권한 관리 Hook (authStore 기반)
 * ⚠️ 권한 데이터는 useAuth()의 user.permissions에서 관리됩니다.
 *
 * @returns {Object} 권한 체크 함수들
 */
export const usePermissions = () => {
  // authStore에서 사용자 정보 획득
  const { user } = useAuth();

  return {
    // 권한 체크 (사용자 객체 기반)
    hasPermission: (permission) => {
      if (!user?.permissions) {
        return false;
      }
      return hasWildcardPermission(user.permissions, permission);
    },

    hasAllPermissions: (requiredPermissions) => {
      if (!user?.permissions) {
        return false;
      }
      return requiredPermissions.every((permission) => hasWildcardPermission(user.permissions, permission));
    },

    hasAnyPermission: (requiredPermissions) => {
      if (!user?.permissions) {
        return false;
      }
      return requiredPermissions.some((permission) => hasWildcardPermission(user.permissions, permission));
    },

    hasFeature: (feature) => {
      if (!user?.features) {
        return false;
      }
      return user.features.includes(feature);
    },

    // 상태
    get permissions() {
      return user?.permissions || [];
    },
    get features() {
      return user?.features || [];
    },
    get loginId() {
      return user?.id || null;
    },
    get currentTenantId() {
      return user?.tenantId || null;
    },

    // 개발 환경
    shouldBypassAuth: shouldBypassAuth(),
    createDevUser
  };
};
