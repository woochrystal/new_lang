import { z } from 'zod';

import { POSITION_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 입력 - 직급 생성/수정
 * @typedef {Object} PositionInput
 * @property {string} posNm - 직급 이름
 * @property {number} posOrd - 정렬 순서
 */

/**
 * 직급 폼 데이터에 대한 Zod 스키마입니다.
 * - `posNm`: 직급 이름, 필수, 최대 50자
 * - `posOrd`: 정렬 순서, 필수, 정수(0 이상)
 */

export const positionSchema = z.object({
  posNm: z
    .string()
    .min(1, '직급 이름을 입력해주세요.')
    .max(
      POSITION_CONSTANTS.MAX_POS_NM_LENGTH,
      `직급 이름은 최대 ${POSITION_CONSTANTS.MAX_POS_NM_LENGTH}자까지 입력 가능합니다.`
    ),

  posOrd: z
    .string()
    .max(
      POSITION_CONSTANTS.MAX_POS_ORD_LENGTH,
      `정렬 순서는 최대 ${POSITION_CONSTANTS.MAX_POS_ORD_LENGTH}자까지 입력 가능합니다.`
    )
    .optional()
    .pipe(z.coerce.number().int('정렬 순서는 정수여야 합니다.').min(0, '정렬 순서는 0 이상이어야 합니다.'))
});

/**
 * 전체 폼 데이터의 유효성을 검증합니다.
 * @param {object} data - 검증할 폼 데이터 객체
 * @returns {{success: boolean, data: object | null, errors: Record<string, string>}} 검증 결과 객체. 성공 시 data 포함, 실패 시 errors 객체 포함.
 */
export const validateExampleForm = (data) => {
  try {
    const validatedData = positionSchema.parse(data);
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
