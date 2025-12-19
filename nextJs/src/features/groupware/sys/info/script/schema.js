/*
 * path           : features/groupware/sys/info/script
 * fileName       : schema.js
 * author         : Park ChangHyeon
 * date           : 25.12.16
 * description    : 회사 정보 폼 검증 스키마
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.16        Park ChangHyeon       최초 생성
 */
import { z } from 'zod';

/**
 * 회사 정보 폼 검증
 */
export const companyInfoSchema = z.object({
  // 기본 정보 (tenantNm)
  tenantName: z.union([
    z.string().min(1, '기업명을 입력해주세요.').max(50, '기업명은 최대 50자까지 입력 가능합니다.'),
    z.literal(''),
    z.null(),
    z.undefined()
  ]),

  // 사업자등록번호 (bsnsRegNo)
  bizRegNo: z.union([
    z
      .string()
      .min(1, '사업자등록번호를 입력해주세요.')
      .regex(/^\d{3}-\d{2}-\d{5}$/, '사업자등록번호 형식이 올바르지 않습니다. (000-00-00000)')
      .max(20, '사업자등록번호는 최대 20자까지 입력 가능합니다.'),
    z.literal(''),
    z.null(),
    z.undefined()
  ]),

  // 관리자 정보
  mgrNm: z.union([z.string().max(50, '관리자명은 최대 50자 이하여야 합니다.'), z.literal(''), z.null(), z.undefined()]),

  mgrEmail: z.union([
    z
      .string()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '올바른 이메일 형식이 아닙니다.')
      .max(100, '이메일은 최대 100자 이하여야 합니다.'),
    z.literal(''),
    z.null(),
    z.undefined()
  ]),

  mgrTel: z.union([
    z
      .string()
      .regex(
        /^(0\d{1,2}-\d{3,4}-\d{4}|\+[\d-]{5,25})$/,
        '전화번호 형식이 올바르지 않습니다. (예: 02-1234-5678 또는 +82-10-1234-5678)'
      )
      .max(20, '관리자 전화번호는 최대 20자 이하여야 합니다.'),
    z.literal(''),
    z.null(),
    z.undefined()
  ]),

  // 연락처 정보 (tenantTel)
  telNo: z.union([
    z
      .string()
      .regex(
        /^(0\d{1,2}-\d{3,4}-\d{4}|\+[\d-]{5,25})$/,
        '전화번호 형식이 올바르지 않습니다. (예: 02-1234-5678 또는 +82-10-1234-5678)'
      )
      .max(20, '전화번호는 최대 20자 이하여야 합니다.'),
    z.literal(''),
    z.null(),
    z.undefined()
  ]),

  // 주소 정보
  addr: z.union([z.string().max(200, '주소는 최대 200자 이하여야 합니다.'), z.literal(''), z.null(), z.undefined()]),

  addrDetail: z.union([
    z.string().max(100, '상세주소는 100자 이내로 입력해주세요'),
    z.literal(''),
    z.null(),
    z.undefined()
  ])
});

/**
 * 폼 데이터 검증
 * @param {Object} data - 검증할 데이터
 * @returns {Object} { success: boolean, data?: Object, errors?: Object }
 */
export const validateCompanyInfo = (data) => {
  const result = companyInfoSchema.safeParse(data);

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
