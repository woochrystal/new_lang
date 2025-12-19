import { z } from 'zod';

import { JOIN_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 입력 - 기업 회원 가입 신청 (JoinIDT 기반)
 * @typedef {Object} JoinInput
 * @property {string} domainPath - 도메인 경로
 * @property {string} tenantNm - 기업 이름
 * @property {string} bsnsRegNo - 사업자등록번호
 * @property {string} tenantTel - 기업 전화번호
 * @property {string} addr - 주소
 * @property {string} mgrEmail - 관리자 이메일
 * @property {string} mgrNm - 관리자 이름
 * @property {string} mgrTel - 관리자 전화번호
 */

/**
 * 기업 회원 가입 폼 데이터에 대한 Zod 스키마
 */
export const joinSchema = z.object({
  // 도메인 경로 (domainPath): @NotBlank, @Size(10), @Pattern(a-z0-9-)
  domainPath: z
    .string()
    .min(1, '도메인 경로를 입력해주세요.')
    .max(
      JOIN_CONSTANTS.MAX_DOMAIN_PATH_LENGTH,
      `도메인 경로는 최대 ${JOIN_CONSTANTS.MAX_DOMAIN_PATH_LENGTH}자까지 입력 가능합니다.`
    )
    .regex(/^[a-z0-9-]+$/, '도메인 경로는 영문 소문자, 숫자, 하이픈만 사용 가능합니다.'),

  // 기업명 (tenantNm): @NotBlank, @Size(50)
  tenantNm: z
    .string()
    .min(1, '기업명을 입력해주세요.')
    .max(
      JOIN_CONSTANTS.MAX_TENANT_NM_LENGTH,
      `기업명은 최대 ${JOIN_CONSTANTS.MAX_TENANT_NM_LENGTH}자까지 입력 가능합니다.`
    ),

  // 로그인 아이디 (loginId): @NotBlank, @Size(26)
  loginId: z
    .string()
    .min(1, '관리자 아이디를 입력해주세요.')
    .regex(/^[a-z0-9]+$/, {
      message: '영문 소문자와 숫자만 입력할 수 있습니다.'
    })
    .max(
      JOIN_CONSTANTS.MAX_LOGIN_ID_LENGTH,
      `관리자 아이디는 최대 ${JOIN_CONSTANTS.MAX_LOGIN_ID_LENGTH}자까지 입력 가능합니다.`
    ),

  // 사업자등록번호 (bsnsRegNo): @Pattern(000-00-00000)
  bsnsRegNo: z
    .string()
    .min(1, '사업자등록번호를 입력해주세요.')
    .regex(/^\d{3}-\d{2}-\d{5}$/, '사업자등록번호 형식이 올바르지 않습니다. (000-00-00000)')
    .max(
      JOIN_CONSTANTS.MAX_BSNS_REG_NO_LENGTH,
      `사업자등록번호는 최대 ${JOIN_CONSTANTS.MAX_BSNS_REG_NO_LENGTH}자까지 입력 가능합니다.`
    ),

  // 기업 전화번호 (tenantTel): @Size(20)
  tenantTel: z
    .string()
    .regex(/^[0-9-]+$/, {
      message: '숫자와 하이픈만 입력할 수 있습니다.'
    })
    .max(
      JOIN_CONSTANTS.MAX_TENANT_TEL_LENGTH,
      `전화번호는 최대 ${JOIN_CONSTANTS.MAX_TENANT_TEL_LENGTH}자 이하여야 합니다.`
    )
    .optional()
    .or(z.literal('')),

  // 주소 (addr): @Size(200)
  addr: z
    .string()
    .max(JOIN_CONSTANTS.MAX_ADDR_LENGTH, `주소는 최대 ${JOIN_CONSTANTS.MAX_ADDR_LENGTH}자 이하여야 합니다.`)
    .optional()
    .or(z.literal('')),

  // 관리자 이메일 (mgrEmail): @Email, @Size(100)
  mgrEmail: z
    .email('올바른 이메일 형식이 아닙니다.')
    .max(JOIN_CONSTANTS.MAX_MGR_EMAIL_LENGTH, `이메일은 최대 ${JOIN_CONSTANTS.MAX_MGR_EMAIL_LENGTH}자 이하여야 합니다.`)
    .optional()
    .or(z.literal('')),

  // 관리자명 (mgrNm): @Size(50)
  mgrNm: z
    .string()
    .max(JOIN_CONSTANTS.MAX_MGR_NM_LENGTH, `관리자명은 최대 ${JOIN_CONSTANTS.MAX_MGR_NM_LENGTH}자 이하여야 합니다.`)
    .optional()
    .or(z.literal('')),

  // 관리자 전화번호 (mgrTel): @Size(20)
  mgrTel: z
    .string()
    .regex(/^[0-9-]+$/, {
      message: '숫자와 하이픈만 입력할 수 있습니다.'
    })
    .max(
      JOIN_CONSTANTS.MAX_MGR_TEL_LENGTH,
      `관리자 전화번호는 최대 ${JOIN_CONSTANTS.MAX_MGR_TEL_LENGTH}자 이하여야 합니다.`
    )
    .optional()
    .or(z.literal(''))
});

/**
 * 단일 필드의 유효성을 실시간으로 검증합니다.
 * @param {keyof typeof joinSchema.shape} fieldName - 검증할 필드의 이름
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체
 */
export const validateJoinField = (fieldName, value) => {
  try {
    const fieldSchema = joinSchema.shape[fieldName];
    const finalValue = value === null || value === undefined ? '' : value;
    fieldSchema.parse(finalValue);
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
export const validateJoinForm = (data) => {
  try {
    const validatedData = joinSchema.parse(data);
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
