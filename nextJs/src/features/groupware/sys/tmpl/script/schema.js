import { z } from 'zod';

/**
 * 템플릿 폼 유효성 검사 스키마
 * 참고: 템플릿 코드(tmplCd)는 백엔드에서 자동 생성되므로 유효성 검사에서 제외
 */
export const tmplSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자 이내여야 합니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  // eslint-disable-next-line camelcase
  useYn: z.enum(['Y', 'N'], { required_error: '사용여부는 필수입니다' })
});

/**
 * 템플릿 폼 유효성 검사 함수
 * @param {Object} formData - 검사할 폼 데이터
 * @returns {Object} { success: boolean, errors: Object }
 */
export const validateTmplForm = function (formData) {
  try {
    tmplSchema.parse(formData);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error?.issues) {
      error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
    }
    return { success: false, errors };
  }
};
