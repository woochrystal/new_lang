/**
 * @fileoverview VacCnt Zod 스키마 정의
 * @description 휴가일수관리 데이터 유효성 검증 스키마
 */

import { z } from 'zod';

import { VACCNT_CONSTANTS } from './constants';

/**
 * 휴가일수 입력 스키마
 */
export const vacCntSchema = z.object({
  empName: z.string().min(1, '직원명을 입력해주세요.').max(50, '직원명은 50자 이내로 입력해주세요.'),

  year: z
    .number({
      // eslint-disable-next-line camelcase
      required_error: '기준년도를 선택해주세요.',
      // eslint-disable-next-line camelcase
      invalid_type_error: '기준년도는 숫자여야 합니다.'
    })
    .int('기준년도는 정수여야 합니다.')
    .min(2000, '기준년도는 2000년 이상이어야 합니다.')
    .max(2100, '기준년도는 2100년 이하여야 합니다.'),

  usedVacationDays: z
    .number({
      // eslint-disable-next-line camelcase
      required_error: '휴가 사용일을 입력해주세요.',
      // eslint-disable-next-line camelcase
      invalid_type_error: '휴가 사용일은 숫자여야 합니다.'
    })
    .min(VACCNT_CONSTANTS.VALIDATION.MIN_VACATION_DAYS, '휴가 사용일은 0 이상이어야 합니다.')
    .max(VACCNT_CONSTANTS.VALIDATION.MAX_VACATION_DAYS, '휴가 사용일은 999 이하여야 합니다.')
    .refine((val) => {
      // 소수점 첫째자리까지만 허용
      const decimalPlaces = (val.toString().split('.')[1] || '').length;
      return decimalPlaces <= VACCNT_CONSTANTS.VALIDATION.MAX_DECIMAL_PLACES;
    }, '휴가 사용일은 소수점 첫째자리까지만 입력 가능합니다.'),

  totalVacationDays: z
    .number({
      // eslint-disable-next-line camelcase
      required_error: '총 휴가 일수를 입력해주세요.',
      // eslint-disable-next-line camelcase
      invalid_type_error: '총 휴가 일수는 숫자여야 합니다.'
    })
    .min(VACCNT_CONSTANTS.VALIDATION.MIN_VACATION_DAYS, '총 휴가 일수는 0 이상이어야 합니다.')
    .max(VACCNT_CONSTANTS.VALIDATION.MAX_VACATION_DAYS, '총 휴가 일수는 999 이하여야 합니다.')
    .refine((val) => {
      // 소수점 첫째자리까지만 허용
      const decimalPlaces = (val.toString().split('.')[1] || '').length;
      return decimalPlaces <= VACCNT_CONSTANTS.VALIDATION.MAX_DECIMAL_PLACES;
    }, '총 휴가 일수는 소수점 첫째자리까지만 입력 가능합니다.')
});

/**
 * 휴가일수 목록 조회 쿼리 스키마
 */
export const vacCntListQuerySchema = z.object({
  year: z.number().int().optional(),
  empName: z.string().optional(),
  page: z.number().int().min(1).optional(),
  size: z.number().int().min(1).max(100).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional()
});

/**
 * 개별 필드 유효성 검사
 * @param {string} fieldName - 필드 이름
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error?: string}} 검증 결과
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = vacCntSchema.shape[fieldName];
    if (!fieldSchema) {
      return { success: false, error: '유효하지 않은 필드입니다.' };
    }

    fieldSchema.parse(value);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: '유효성 검사 중 오류가 발생했습니다.' };
  }
};

/**
 * 전체 폼 유효성 검사
 * @param {Object} formData - 검증할 폼 데이터
 * @returns {{success: boolean, errors?: Object}} 검증 결과
 */
export const validateVacCntForm = (formData) => {
  try {
    vacCntSchema.parse(formData);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ZodError 호환 처리: errors | issues | flatten()
      const fieldErrors = {};

      // 1) flatten()이 있는 경우 가장 단순하게 1번째 메시지 사용
      if (typeof error.flatten === 'function') {
        const flat = error.flatten();
        const map = flat?.fieldErrors || {};
        Object.keys(map).forEach((key) => {
          const messages = map[key];
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[key] = messages[0];
          }
        });
      } else {
        // 2) fallback: errors 또는 issues 배열 순회
        const issues = error.errors ?? error.issues ?? [];
        issues.forEach((err) => {
          const field = Array.isArray(err?.path) ? err.path[0] : undefined;
          if (field != null) {
            fieldErrors[field] = err.message;
          }
        });
      }

      return { success: false, errors: fieldErrors };
    }
    return { success: false, errors: { _form: '유효성 검사 중 오류가 발생했습니다.' } };
  }
};

/**
 * TypeScript 타입 추출 (JSDoc용)
 * @typedef {z.infer<typeof vacCntSchema>} VacCntInput
 * @typedef {z.infer<typeof vacCntListQuerySchema>} VacCntListQuery
 */
