import { z } from 'zod';

import { ORGANIZATION_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 입력 - 조직 생성/수정
 * @typedef {Object} OrganizationInput
 * @property {string} deptNm - 조직 이름
 * @property {number|null} uppDeptId - 상위 조직 ID
 * @property {number} deptOrd - 정렬 순서
 */

/**
 * 조직 폼 데이터에 대한 Zod 스키마
 */
export const organizationSchema = z.object({
  deptNm: z
    .string()
    .min(1, '조직명을 입력해주세요.')
    .max(
      ORGANIZATION_CONSTANTS.MAX_DEPT_NM_LENGTH,
      `조직명은 최대 ${ORGANIZATION_CONSTANTS.MAX_DEPT_NM_LENGTH}자까지 입력 가능합니다.`
    ),

  uppDeptId: z.number()
});

/**
 * 단일 필드의 유효성을 실시간으로 검증합니다.
 * @param {keyof typeof organizationSchema.shape} fieldName - 검증할 필드의 이름
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = organizationSchema.shape[fieldName];
    fieldSchema.parse(value);
    return { success: true, error: null };
  } catch (error) {
    if (error?.issues && Array.isArray(error.issues) && error.issues.length > 0) {
      return {
        success: false,
        error: error.issues[0].message
      };
    }

    return {
      success: false,
      error: error?.message || '유효하지 않은 값입니다.'
    };
  }
};

/**
 * 전체 폼 데이터의 유효성을 검증합니다.
 * @param {object} data - 검증할 폼 데이터 객체
 * @returns {{success: boolean, data: object | null, errors: Record<string, string>}} 검증 결과 객체
 */
export const validateOrganizationForm = (data) => {
  try {
    const validatedData = organizationSchema.parse(data);
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
