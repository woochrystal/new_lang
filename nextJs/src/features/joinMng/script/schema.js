import { z } from 'zod';

import { JOINMNG_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 쿼리 - 가입신청 목록 조회
 * @typedef {Object} JoinMngListQuery
 * @property {number} [page=1] - 페이지 번호
 * @property {number} [size=10] - 페이지 크기
 * @property {string} [searchKeyword] - 검색 키워드 (회사명, 담당자)
 * @property {string} [joinSt] - 승인 상태(PENDING, APPROVED, DENIED) (SQL: join_st)
 * @property {date} [startDate] - 검색 시작일 (신청일)
 * @property {date} [endDate] - 검색 종료일 (신청일)
 */

/**
 * API 입력 - 가입신청 항목 (SQL: tenant_nm, mgr_nm 등 반영)
 * @typedef {Object} JoinMngInput
 * @property {string} tenantNm - 회사명 (SQL: tenant_nm)
 * @property {string} ceoNm - 대표자 이름
 * @property {string} mainSvc - 주요서비스
 * @property {string} bsnsRegNo - 사업자등록번호 (숫자만) (SQL: bsns_reg_no)
 * @property {string} mgrNm - 담당자 이름 (SQL: mgr_nm)
 * @property {string} mgrTel - 담당자 전화번호 (SQL: mgr_tel)
 * @property {string} note - 비고
 */

/**
 * 가입신청 폼 데이터에 대한 Zod 스키마입니다.
 * - `tenantNm`: 회사명 (SQL: tenant_nm), 필수, 최대 길이 제한
 * - `mgrNm`: 담당자 이름 (SQL: mgr_nm), 최대 길이 제한
 */
export const joinMngSchema = z.object({
  tenantNm: z
    .string()
    .min(1, { message: '회사명을 입력해 주세요.' })
    .max(JOINMNG_CONSTANTS.MAX_PTNR_NM_LENGTH, {
      message: `${JOINMNG_CONSTANTS.MAX_PTNR_NM_LENGTH}자 이내로 입력 가능합니다.`
    }),

  ceoNm: z
    .string()
    .max(JOINMNG_CONSTANTS.MAX_CEO_NM_LENGTH, {
      message: `${JOINMNG_CONSTANTS.MAX_CEO_NM_LENGTH}자 이내로 입력 가능합니다.`
    })
    .optional(),

  mainSvc: z
    .string()
    .max(JOINMNG_CONSTANTS.MAX_MAIN_SVC_LENGTH, {
      message: `${JOINMNG_CONSTANTS.MAX_MAIN_SVC_LENGTH}자 이내로 입력 가능합니다.`
    })
    .optional(),

  // 사업자등록번호: 필수, 숫자만 10자리 (SQL: bsns_reg_no)
  bsnsRegNo: z
    .string()
    .min(1, { message: '사업자번호를 입력해 주세요.' })
    .regex(/^\d{10}$/, { message: '사업자번호는 숫자 10자리여야 합니다.' }),

  // mainMgr -> mgrNm (SQL: mgr_nm)
  mgrNm: z
    .string()
    .max(JOINMNG_CONSTANTS.MAX_MAIN_MGR_LENGTH, {
      message: `${JOINMNG_CONSTANTS.MAX_MAIN_MGR_LENGTH}자 이내로 입력 가능합니다.`
    })
    .optional(),

  // 담당자 연락처 (SQL: mgr_tel)
  mgrTel: z
    .string()
    .max(JOINMNG_CONSTANTS.MAX_MGR_TEL_LENGTH, {
      message: `${JOINMNG_CONSTANTS.MAX_MGR_TEL_LENGTH}자 이내로 입력 가능합니다.`
    })
    .regex(/^[0-9-]*$/, { message: '연락처는 숫자와 하이픈(-)만 입력 가능합니다.' })
    .optional(),

  note: z
    .string()
    .max(JOINMNG_CONSTANTS.MAX_NOTE_LENGTH, {
      message: `${JOINMNG_CONSTANTS.MAX_NOTE_LENGTH}자 이내로 입력 가능합니다.`
    })
    .optional()
});

/**
 * 단일 필드의 유효성을 실시간으로 검증합니다.
 * @param {keyof typeof joinMngSchema.shape} fieldName - 검증할 필드의 이름
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체.
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = joinMngSchema.shape[fieldName];
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
 * @returns {{success: boolean, data: object | null, errors: Record<string, string>}} 검증 결과 객체.
 */
export const validateExampleForm = (data) => {
  try {
    const validatedData = joinMngSchema.parse(data);
    return { success: true, data: validatedData, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: '폼 데이터 유효성 검증에 실패했습니다.' } };
  }
};
