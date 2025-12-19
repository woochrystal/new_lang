/**
 * @fileoverview 내 정보 폼 검증 스키마 (Zod)
 */

import { z } from 'zod';

/**
 * 전화번호 검증 정규식 (010-1234-5678, 02-1234-5678 등)
 */
const phoneRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;

/**
 * 이메일 검증 정규식
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 내선번호 검증 정규식 (전화번호 형식과 동일)
 */
const extensionRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;

/**
 * 사용자 정보 스키마
 */
export const userInfoSchema = z
  .object({
    // 기본 정보
    name: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이내로 입력해주세요'),
    englishName: z.union([z.string().max(100, '영어 이름은 100자 이내로 입력해주세요'), z.literal('')]).optional(),
    phone: z
      .union([
        z.string().refine((val) => phoneRegex.test(val), '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
        z.literal('')
      ])
      .optional(),

    // 조직 정보
    department: z.union([z.string(), z.literal('')]).optional(),
    departmentName: z.union([z.string(), z.literal('')]).optional(),
    position: z.union([z.string(), z.literal('')]).optional(),
    positionName: z.union([z.string(), z.literal('')]).optional(),
    email: z
      .union([z.string().refine((val) => emailRegex.test(val), '올바른 이메일 형식이 아닙니다'), z.literal('')])
      .optional(),

    // 계정 정보
    id: z.string(),
    role: z.union([z.string(), z.literal('')]).optional(),

    // 개인 정보
    birthDate: z.union([z.string(), z.literal('')]).optional(),
    company: z.union([z.string(), z.literal('')]).optional(),
    emergencyContact: z
      .union([
        z.string().refine((val) => phoneRegex.test(val), '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
        z.literal('')
      ])
      .optional(),
    education: z.union([z.string(), z.literal('')]).optional(),

    // 연락처 정보
    address: z.union([z.string().max(200, '주소는 200자 이내로 입력해주세요'), z.literal('')]).optional(),
    roadAddress: z.union([z.string().max(200, '도로명주소는 200자 이내로 입력해주세요'), z.literal('')]).optional(),
    addressDetail: z.union([z.string().max(100, '상세주소는 100자 이내로 입력해주세요'), z.literal('')]).optional(),
    extension: z
      .union([
        z.string().refine((val) => extensionRegex.test(val), '올바른 내선번호 형식이 아닙니다 (예: 02-1234-5678)'),
        z.literal('')
      ])
      .optional(),

    // 재직 정보
    joinDate: z.union([z.string(), z.literal('')]).optional(),
    leaveDate: z.union([z.string(), z.literal('')]).optional(),
    note: z.union([z.string().max(500, '비고는 500자 이내로 입력해주세요'), z.literal('')]).optional()
  })
  .passthrough(); // 파일 필드 등 추가 필드 허용

/**
 * 폼 데이터 검증
 * @param {Object} data - 검증할 데이터
 * @returns {Object} { success: boolean, data?: Object, errors?: Object }
 */
export const validateUserInfo = (data) => {
  const result = userInfoSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // 검증 실패 - 에러 메시지를 필드별로 매핑
  const errors = {};
  if (result.error?.issues) {
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      if (fieldName && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });
  }

  return { success: false, errors };
};
