import { z } from 'zod';

/**
 * 로그인 폼 검증 스키마
 */
export const loginSchema = z.object({
  userId: z.string().min(1, '아이디를 입력해주세요.'),

  userPw: z.string().min(1, '비밀번호를 입력해주세요.')
});

/**
 * 개별 필드 검증 함수
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = loginSchema.shape[fieldName];
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
 * 전체 폼 검증 함수
 */
export const validateLoginForm = (data) => {
  try {
    const validatedData = loginSchema.parse(data);
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
