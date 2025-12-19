import { z } from 'zod';

import { BOARD_CONSTANTS } from './constants';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 입력 - 게시글 생성/수정
 * @typedef {Object} BoardInput
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 */

/**
 * API 쿼리 - 게시글 목록 조회
 * @typedef {Object} BoardListQuery
 * @property {number} [page=1] - 페이지 번호
 * @property {number} [size=10] - 페이지 크기
 * @property {string} [searchKeyword] - 검색 키워드
 */

/**
 * 게시글 폼 데이터에 대한 Zod 스키마입니다.
 * - `title`: 제목, 필수, 최대 길이 제한
 * - `content`: 내용, 필수, 최대 길이 제한
 */
export const boardSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(BOARD_CONSTANTS.MAX_TITLE_LENGTH, `제목은 최대 ${BOARD_CONSTANTS.MAX_TITLE_LENGTH}자까지 입력 가능합니다.`),

  content: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .max(BOARD_CONSTANTS.MAX_CONTENT_LENGTH, `내용은 최대 ${BOARD_CONSTANTS.MAX_CONTENT_LENGTH}자까지 입력 가능합니다.`)
});

/**
 * 단일 필드의 유효성을 검증합니다.
 * @param {keyof typeof boardSchema.shape} fieldName - 검증할 필드의 이름 (e.g., 'title', 'content')
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체. 성공 시 error는 null.
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = boardSchema.shape[fieldName];
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
    const validatedData = boardSchema.parse(data);
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
