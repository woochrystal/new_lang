import { z } from 'zod';

import { ROLE_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 입력 - 권한 생성/수정
 * @typedef {Object} RoleInput
 * @property {string} authNm - 권한 이름
 * @property {string} authDesc - 권한 설명
 */

/**
 * 권한 폼 데이터에 대한 Zod 스키마
 */
export const roleSchema = z.object({
  authNm: z
    .string()
    .min(1, '권한명을 입력해주세요.')
    .max(
      ROLE_CONSTANTS.MAX_AUTH_NM_LENGTH,
      `권한명은 최대 ${ROLE_CONSTANTS.MAX_AUTH_NM_LENGTH}자까지 입력 가능합니다.`
    ),

  authDesc: z
    .string()
    .max(
      ROLE_CONSTANTS.MAX_AUTH_DESC_LENGTH,
      `권한 설명은 최대 ${ROLE_CONSTANTS.MAX_AUTH_DESC_LENGTH}자까지 입력 가능합니다.`
    )
    .optional()
});

/**
 * 전체 폼 데이터의 유효성을 검증합니다.
 * @param {object} data - 검증할 폼 데이터 객체
 * @returns {{success: boolean, data: object | null, errors: Record<string, string>}} 검증 결과 객체
 */
export const validateRoleForm = (data) => {
  try {
    const validatedData = roleSchema.parse(data);
    return { success: true, data: validatedData, errors: {} };
  } catch (error) {
    const errors = {};

    const issues = error?.issues || [];
    issues.forEach((issue) => {
      if (issue?.path && issue.path.length > 0) {
        errors[issue.path[0]] = issue.message || '유효하지 않은 값입니다.';
      }
    });

    return { success: false, data: null, errors };
  }
};
