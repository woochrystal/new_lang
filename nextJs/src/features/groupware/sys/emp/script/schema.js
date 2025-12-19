import { z } from 'zod';

// ============================================
// 폼 검증용 타입 정의
// ============================================

/**
 * API 입력 - 직원 생성/수정
 * @typedef {Object} EmpInput
 * @property {string} empNo - 사번
 * @property {string} name - 이름
 * @property {string} userId - 사용자 ID
 * @property {string} email - 이메일
 * @property {string} department - 부서
 * @property {string} position - 직위
 * @property {string} role - 역할
 * @property {string} phone - 연락처
 * @property {string} address - 주소
 * @property {string} joinDate - 입사일
 * @property {string} workStatus - 근무상태
 */

/**
 * API 쿼리 - 직원 목록 조회
 * @typedef {Object} EmpListQuery
 * @property {number} [page=1] - 페이지 번호
 * @property {number} [size=20] - 페이지 크기
 * @property {string} [searchKeyword] - 검색 키워드
 * @property {string} [searchType] - 검색 타입 (name, empNo, email 등)
 * @property {string} [empTy] - 계약구분 (FULL: 정직원, CONT: 계약직, PART: 협력사)
 * @property {string} [department] - 부서 필터
 * @property {string} [position] - 직위 필터
 * @property {string} [workStatus] - 근무상태 필터
 */

/**
 * 직원 폼 데이터에 대한 Zod 스키마
 */
export const empSchema = z.object({
  empType: z.enum(['FULL', 'CONT', 'PART'], { errorMap: () => ({ message: '계약구분을 선택해주세요.' }) }),

  empNo: z.string().min(1, '사번을 입력해주세요.').max(20, '사번은 최대 20자까지 입력 가능합니다.'),

  name: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 최대 50자까지 입력 가능합니다.'),

  userId: z
    .string()
    .min(4, '사용자 ID는 최소 4자 이상이어야 합니다.')
    .max(20, '사용자 ID는 최대 20자까지 입력 가능합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자 ID는 영문, 숫자, 언더스코어만 사용 가능합니다.'),

  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),

  department: z.string().min(1, '부서를 선택해주세요.'),

  position: z.string().min(1, '직위를 선택해주세요.'),

  role: z.string().min(1, '역할을 선택해주세요.'),

  phone: z
    .union([
      z.string().regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
      z.literal('')
    ])
    .optional(),

  usrEmgTel: z
    .union([
      z.string().regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
      z.literal('')
    ])
    .optional(),

  address: z.string().optional(),

  joinDate: z.string().min(1, '입사일을 입력해주세요.'),

  workStatus: z.enum(['승인', '반려', '미결'], { errorMap: () => ({ message: '유효한 근무상태를 선택해주세요.' }) })
});

/**
 * 단일 필드의 유효성을 검증합니다.
 * @param {keyof typeof empSchema.shape} fieldName - 검증할 필드의 이름
 * @param {any} value - 검증할 값
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체
 */
export const validateField = (fieldName, value) => {
  try {
    const fieldSchema = empSchema.shape[fieldName];
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
export const validateEmpForm = (data) => {
  try {
    const validatedData = empSchema.parse(data);
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

/**
 * 비밀번호 스키마 (초기화용)
 * 5~12자리, 영문 대소문자, 숫자, 특수문자(!@#$%)만 허용
 */
export const passwordSchema = z
  .string()
  .min(5, '비밀번호는 최소 5자 이상이어야 합니다.')
  .max(12, '비밀번호는 최대 12자까지 입력 가능합니다.')
  .regex(/^[A-Za-z0-9!@#$%]+$/, '영문 대소문자, 숫자, 특수문자(!@#$%)만 사용 가능합니다.');

/**
 * 비밀번호 유효성을 검증합니다.
 * @param {string} password - 검증할 비밀번호
 * @returns {{success: boolean, error: string | null}} 검증 결과 객체
 */
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
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
      error: error?.message || '유효하지 않은 비밀번호입니다.'
    };
  }
};
