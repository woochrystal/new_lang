/**
 * @fileoverview Approval 유효성 검증 스키마
 * @description Zod를 사용한 결재 폼 유효성 검증
 *
 * 스키마 순서:
 * 1. 공통 스키마 (결재선, 파일 상태)
 * 2. 결재 상신 관련 스키마 (일반, 휴가, 비용) - 신규/재상신 공통
 * 3. 유효성 검증 함수
 *
 * 백엔드 DTO 매핑:
 * - generalApprovalSchema → DraftGeneIDT (신규/재상신 공통)
 * - vacationApprovalSchema → DraftVctIDT (신규/재상신 공통)
 * - expenseApprovalSchema → DraftExpnIDT (신규/재상신 공통)
 */

import { z } from 'zod';

// ========================================
// 1. 공통 스키마
// ========================================

/**
 * 결재선 스키마 (공통)
 * 프론트엔드 State: approvalLine (변환 전)
 * 백엔드 DTO: approvers: List<AprvStepIDT>
 *
 * AprvStepIDT: {
 *   aprvStep: string,   // "1", "2", "3"
 *   aprvUsrId: number   // 결재자 ID
 * }
 */
const approvalLineSchema = z
  .array(
    z.object({
      usrId: z.number(), // 백엔드로 보낼 때 aprvUsrId로 변환
      usrNm: z.string()
    })
  )
  .min(1, '결재선을 최소 1명 이상 설정해주세요.');

/**
 * 파일 상태 스키마 (재상신용 공통)
 * 프론트엔드 State: fileState (수정 시)
 * 백엔드 DTO: FormData + FileMetaIDT
 *
 * FileMetaIDT: {
 *   fileId: number,      // 기존 파일 그룹 ID
 *   deletedIds: number[] // 삭제할 파일 ID 목록
 * }
 */
const fileStateSchema = z.object({
  fileId: z.number().nullable(),
  existing: z.array(z.any()), // 기존 파일 메타데이터 (API에서 받은 데이터)
  new: z
    .array(
      z.custom((file) => file instanceof File, {
        message: '유효한 파일이 아닙니다.'
      })
    )
    .max(5, '최대 5개의 파일만 첨부할 수 있습니다.')
    .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), {
      message: '파일 크기는 10MB 이하여야 합니다.'
    }),
  deletedIds: z.array(z.number())
});

// ========================================
// 2. 결재 상신 관련 스키마 (신규/재상신 공통)
// ========================================

/**
 * 일반결재 스키마 (신규 상신 & 재상신 공통)
 * 백엔드 DTO: DraftGeneIDT
 *
 * 필드 매핑:
 * - approvalLine → approvers (변환: convertApprovalLine)
 * - aprvTitle → aprvTitle (동일)
 * - aprvCtt → aprvCtt (동일)
 * - fileState.new → FormData files (신규 파일)
 * - fileState.existing → 기존 파일 (재상신 시)
 * - fileState.deletedIds → 삭제할 파일 ID (재상신 시)
 * - aprvSts → 'REQ' | 'TEMP' (API 호출 시 추가)
 */
const generalApprovalSchema = z.object({
  approvalLine: approvalLineSchema,
  aprvTitle: z.string().min(1, '제목을 입력해주세요.'),
  aprvCtt: z.string().min(1, '내용을 입력해주세요.'),
  fileState: fileStateSchema
});

/**
 * 휴가결재 스키마 (신규 상신 & 재상신 공통)
 * 백엔드 DTO: DraftVctIDT
 *
 * 필드 매핑:
 * - approvalLine → approvers (변환: convertApprovalLine)
 * - vacTy → vacTy (동일)
 * - vacStaDt → vacStaDt (Date → 'YYYY-MM-DD' 변환)
 * - vacEndDt → vacEndDt (Date → 'YYYY-MM-DD' 변환)
 * - vacDays → vacDays (number → Double, 최소 0.5)
 * - subId → subId (number, @NotNull)
 * - emgTel → emgTel (정규식: ^\d{2,3}-\d{3,4}-\d{4}$)
 * - vacRsn → vacRsn (string)
 * - trfNote → trfNote (string)
 * - aprvSts → 'REQ' | 'TEMP' (API 호출 시 추가)
 */
const vacationApprovalSchema = z
  .object({
    approvalLine: approvalLineSchema,
    vacTy: z.string().refine((val) => val !== '-', { message: '휴가종류를 선택해주세요.' }),
    vacStaDt: z.date().refine((val) => val !== undefined && val !== null, {
      message: '휴가 시작일을 선택해주세요.'
    }),
    vacEndDt: z.date().refine((val) => val !== undefined && val !== null, {
      message: '휴가 종료일을 선택해주세요.'
    }),
    vacDays: z.number().min(0, '휴가일수는 0 이상이어야 합니다.'),
    subId: z
      .number()
      .nullable()
      .refine((val) => val !== null && val !== undefined, {
        message: '대무자를 선택해주세요.'
      }),
    emgTel: z
      .string()
      .refine((val) => val.trim().length > 0, {
        message: '비상연락처를 입력해주세요.'
      })
      .regex(/^\d{2,3}-\d{3,4}-\d{4}$/, {
        message: '연락처 형식이 올바르지 않습니다. (예: 010-1234-5678)'
      }),
    vacRsn: z.string().min(1, '휴가사유를 입력해주세요.'),
    trfNote: z.string().min(1, '업무 인계사항을 입력해주세요.')
  })
  .superRefine((data, ctx) => {
    // 시작일이 종료일보다 늦으면 안 됨
    if (data.vacStaDt && data.vacEndDt && data.vacStaDt > data.vacEndDt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '휴가 종료일은 시작일보다 늦거나 같아야 합니다.',
        path: ['vacEndDt']
      });
    }

    // 연차(DAY) 또는 병가(SICK)일 때는 최소 1일 이상
    if ((data.vacTy === 'DAY' || data.vacTy === 'SICK') && data.vacDays < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '연차 또는 병가는 최소 1일 이상이어야 합니다.',
        path: ['vacDays']
      });
    }

    // 백엔드 @DecimalMin(0.5) 검증 추가
    if (data.vacDays < 0.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '휴가일수는 최소 0.5일 이상이어야 합니다.',
        path: ['vacDays']
      });
    }
  });

/**
 * 비용결재 스키마 (신규 상신 & 재상신 공통)
 * 백엔드 DTO: DraftExpnIDT
 *
 * 필드 매핑:
 * - approvalLine → approvers (변환: convertApprovalLine)
 * - expnTy → expnTy (동일)
 * - cardNo → cardNo (string, optional)
 * - expnDt → expnDt (Date → 'YYYY-MM-DD' 변환)
 * - payAmt → payAmt (number → Long, 최소 1)
 * - fileState.new → FormData files (영수증, 신규 파일)
 * - fileState.existing → 기존 파일 (재상신 시)
 * - fileState.deletedIds → 삭제할 파일 ID (재상신 시)
 * - expnRsn → expnRsn (string)
 * - aprvSts → 'REQ' | 'TEMP' (API 호출 시 추가)
 */
const expenseApprovalSchema = z
  .object({
    approvalLine: approvalLineSchema,
    expnTy: z.string().refine((val) => val !== '-', { message: '결제수단을 선택해주세요.' }),
    cardNo: z.string().optional(),
    expnDt: z.date().refine((val) => val !== undefined && val !== null, {
      message: '비용 사용일자를 선택해주세요.'
    }),
    payAmt: z.number().min(1, '사용금액을 입력해주세요.'), // 백엔드: Long @Min(1)
    fileState: fileStateSchema,
    expnRsn: z.string().min(1, '지출사유를 입력해주세요.')
  })
  .superRefine((data, ctx) => {
    // 현금이 아닐 때(카드 결제일 때)는 카드번호 필수
    if (data.expnTy !== 'CASH' && (!data.cardNo || data.cardNo.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '카드번호를 입력해주세요.',
        path: ['cardNo']
      });
    }

    // fileState 검증: 기존 파일 + 신규 파일 - 삭제 파일 >= 1
    const existingCount = data.fileState.existing?.length || 0;
    const newCount = data.fileState.new?.length || 0;
    const deletedCount = data.fileState.deletedIds?.length || 0;
    const totalFileCount = existingCount + newCount - deletedCount;

    if (totalFileCount < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '영수증을 최소 1개 이상 첨부해주세요.',
        path: ['fileState']
      });
    }

    // 신규 파일의 타입 검증 (이미지 또는 PDF만 허용)
    if (data.fileState.new && data.fileState.new.length > 0) {
      const invalidFiles = data.fileState.new.filter(
        (file) => !file.type.startsWith('image/') && file.type !== 'application/pdf'
      );
      if (invalidFiles.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '이미지 파일 또는 PDF 파일만 첨부할 수 있습니다.',
          path: ['fileState']
        });
      }
    }
  });

// ========================================
// 3. 결재 의견 스키마 (승인/반려)
// ========================================

/**
 * 결재 의견 스키마 (승인용 - 선택 사항)
 */
const approvalCommentSchema = z.object({
  comment: z.string().optional()
});

/**
 * 반려 의견 스키마 (반려용 - 필수)
 */
const rejectionCommentSchema = z.object({
  comment: z
    .string()
    .min(1, '반려 사유를 입력해주세요.')
    .refine((val) => val.trim().length > 0, {
      message: '반려 사유를 입력해주세요.'
    })
});

// ========================================
// 4. 유효성 검증 함수
// ========================================

/**
 * 결재 폼 유효성 검증 함수 (신규 상신 & 재상신 공통)
 * @param {string} aprvTy - 결재 유형 (GENE/VCT/EXPN)
 * @param {Array} approvalLine - 결재선 배열
 * @param {Object} draftInfo - 결재 타입별 상신 정보
 * @returns {{isValid: boolean, errors: Record<string, string>, firstErrorMessage: string | null}} 검증 결과 객체
 *
 * 사용 예시:
 * ```javascript
 * // 신규 상신
 * const validation = validateApprovalForm('GENE', approvalLine, geneDraftInfo);
 * // 재상신
 * const validation = validateApprovalForm('GENE', approvalLine, geneDraftInfo);
 * if (!validation.isValid) {
 *   showAlert(validation.firstErrorMessage);
 * }
 * ```
 */
export const validateApprovalForm = (aprvTy, approvalLine, draftInfo) => {
  try {
    const data = { approvalLine, ...draftInfo };

    // 결재 유형별 스키마 선택 및 검증
    if (aprvTy === 'GENE') {
      generalApprovalSchema.parse(data);
    } else if (aprvTy === 'VCT') {
      vacationApprovalSchema.parse(data);
    } else if (aprvTy === 'EXPN') {
      expenseApprovalSchema.parse(data);
    }

    return { isValid: true, errors: {}, firstErrorMessage: null };
  } catch (error) {
    const errors = {};

    const issues = error?.issues || [];

    // 필드 순서 정의 (화면에 표시되는 순서)
    const fieldOrderMap = {
      VCT: ['approvalLine', 'vacTy', 'vacStaDt', 'vacEndDt', 'vacDays', 'subId', 'emgTel', 'vacRsn', 'trfNote'],
      GENE: ['approvalLine', 'aprvTitle', 'aprvCtt', 'fileState'],
      EXPN: ['approvalLine', 'expnTy', 'cardNo', 'expnDt', 'payAmt', 'fileState', 'expnRsn']
    };
    const fieldOrder = fieldOrderMap[aprvTy] || fieldOrderMap.EXPN;

    // 모든 에러를 errors 객체에 저장 (같은 필드는 첫 번째 에러만)
    issues.forEach((issue) => {
      const fieldName = issue.path && issue.path.length > 0 ? issue.path[0] : 'unknown';
      const message = issue.message || '유효하지 않은 값입니다.';
      // 같은 필드에 이미 에러가 있으면 덮어쓰지 않음 (첫 번째 에러 유지)
      if (!errors[fieldName]) {
        errors[fieldName] = message;
      }
    });

    // 필드 순서에 따라 첫 번째 에러 찾기
    let firstErrorMessage = null;
    for (const field of fieldOrder) {
      if (errors[field]) {
        firstErrorMessage = errors[field];
        break;
      }
    }

    // fieldOrder에 없는 필드의 에러가 있을 경우 (fallback)
    if (!firstErrorMessage && issues.length > 0) {
      firstErrorMessage = issues[0].message;
    }

    return { isValid: false, errors, firstErrorMessage };
  }
};

/**
 * 결재 의견 유효성 검증 함수 (승인/반려)
 * @param {'approve'|'reject'} type - 결재 타입 (승인/반려)
 * @param {string} comment - 결재 의견
 * @returns {{isValid: boolean, error: string | null}} 검증 결과 객체
 *
 * 사용 예시:
 * ```javascript
 * // 승인
 * const validation = validateApprovalComment('approve', comment);
 * // 반려
 * const validation = validateApprovalComment('reject', comment);
 * if (!validation.isValid) {
 *   showError(validation.error);
 * }
 * ```
 */
export const validateApprovalComment = (type, comment) => {
  try {
    const data = { comment };

    // 타입에 따라 스키마 선택
    if (type === 'approve') {
      approvalCommentSchema.parse(data);
    } else if (type === 'reject') {
      rejectionCommentSchema.parse(data);
    }

    return { isValid: true, error: null };
  } catch (error) {
    const issues = error?.issues || [];

    // 첫 번째 에러 메시지 반환
    const errorMessage = issues.length > 0 ? issues[0].message : '유효하지 않은 값입니다.';

    return { isValid: false, error: errorMessage };
  }
};
