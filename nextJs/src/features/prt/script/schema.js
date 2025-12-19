import { z } from 'zod';

import { PARTNER_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 쿼리 - 협력사 목록 조회
 * @typedef {Object} PartnerListQuery
 * @property {number} [page=1] - 페이지 번호
 * @property {number} [size=10] - 페이지 크기
 * @property {string} [searchKeyword] - 검색 키워드
 * @property {string} [periodType] - 검색 기간(버튼)
 * @property {date} [startDate] - 검색 시작일
 * @property {date} [endDate] - 검색 종료일
 */

/**
 * API 입력 - 협력사 생성/수정
 * @typedef {Object} PartnerInput
 * @property {string} ptnrNm - 협력사 이름
 * @property {string} ceoNm - 대표자 이름
 * @property {string} mainSvc - 주요서비스
 * @property {date} cntrtStaDt - 계약시작일
 * @property {number} bsnsRegNo - 사업자등록번호
 * @property {string} mainMgr - 담당자 이름
 * @property {string} mgrTel - 담당자 전화번호
 * @property {string} note - 비고
 */

/**
 * 협력사 폼 데이터에 대한 Zod 스키마입니다.
 * - `ptnrNm`: 협력사 이름, 필수, 최대 길이 제한
 * - `ceoNm`: 대표자 이름, 최대 길이 제한
 * - `mainSvc`: 주요서비스, 최대 길이 제한
 * - `cntrtStaDt`: 계약시작일, 타입 제한
 * - `bsnsRegNo`: 사업자등록번호, 타입 제한, 포맷팅
 * - `mainMgr`: 담당자 이름, 최대 길이 제한
 * - `mgrTel`: 담당자 전화번호, 타입 제한, 포맷팅
 * - `note`: 비고, 최대 길이 제한
 */

export const partnerSchema = z.object({
  ptnrNm: z
    .string()
    .min(1, '협력사 이름을 입력해주세요.')
    .max(
      PARTNER_CONSTANTS.MAX_PTNR_NM_LENGTH,
      `협력사 이름은 최대 ${PARTNER_CONSTANTS.MAX_PTNR_NM_LENGTH}자까지 입력 가능합니다.`
    ),

  ceoNm: z
    .string()
    .min(1, '대표자 이름을 입력해주세요.')
    .max(
      PARTNER_CONSTANTS.MAX_CEO_NM_LENGTH,
      `대표자 이름은 최대 ${PARTNER_CONSTANTS.MAX_CEO_NM_LENGTH}자까지 입력 가능합니다.`
    ),

  mainSvc: z
    .string()
    .max(
      PARTNER_CONSTANTS.MAX_MAIN_SVC_LENGTH,
      `주요서비스는 최대 ${PARTNER_CONSTANTS.MAX_MAIN_SVC_LENGTH}자까지 입력 가능합니다.`
    ),

  cntrtStaDt: z.date().optional(),

  bsnsRegNo: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, '사업자번호 형식이 올바르지 않습니다. (000-00-00000)')
    .optional()
    .or(z.literal('')), // 빈 문자열 허용

  mainMgr: z
    .string()
    .max(
      PARTNER_CONSTANTS.MAX_MAIN_MGR_LENGTH,
      `담당자 이름은 최대 ${PARTNER_CONSTANTS.MAX_MAIN_MGR_LENGTH}자까지 입력 가능합니다.`
    )
    .optional(),

  mgrTel: z
    .string()
    .max(
      PARTNER_CONSTANTS.MAX_MGR_TEL_LENGTH,
      `담당자 전화번호는 최대 ${PARTNER_CONSTANTS.MAX_MGR_TEL_LENGTH}자까지 입력 가능합니다.`
    )
    .optional(),

  note: z
    .string()
    .max(PARTNER_CONSTANTS.MAX_NOTE_LENGTH, `비고는 최대 ${PARTNER_CONSTANTS.MAX_NOTE_LENGTH}자까지 입력 가능합니다.`)
    .optional()
});

/**
 * 단일 필드의 유효성을 실시간으로 검증합니다.
 * @param {keyof typeof partnerSchema.shape} fieldName - 검증할 필드의 이름 (e.g., 'title', 'content')
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체. 성공 시 error는 null.
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = partnerSchema.shape[fieldName];
    fieldSchema.parse(value);
    return { success: true, error: null };
  } catch (error) {
    if (error?.issues && Array.isArray(error.issues) && error.issues.length > 0) {
      return {
        success: false,
        error: error.issues[0].message
      };
    }

    // 최종 fallback
    return {
      success: false,
      error: error?.message || '유효하지 않은 값입니다.'
    };
  }
};

/**
 * 전체 폼 데이터의 유효성을 검증합니다.
 * @param {object} data - 검증할 폼 데이터 객체 (e.g., { title: '...', content: '...' })
 * @returns {{success: boolean, data: object | null, errors: Record<string, string>}} 검증 결과 객체. 성공 시 data 포함, 실패 시 errors 객체 포함.
 */
export const validateExampleForm = (data) => {
  try {
    const validatedData = partnerSchema.parse(data);
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
