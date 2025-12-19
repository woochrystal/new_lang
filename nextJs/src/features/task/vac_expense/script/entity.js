/**
 * @fileoverview Task Vac/Expense Entity (업무관리 휴가/비용 결재 관련)
 * @description 업무관리 - 휴가관리/비용관리 목록 조회용 Entity
 *
 * Entity 포함:
 * 1. TaskVacPagination - 페이지네이션 (휴가용)
 * 2. TaskVacApproval - 휴가 결재 문서 목록
 * 3. TaskVacApprovalList - 휴가 결재 문서 목록 Wrapper
 * 4. TaskExpensePagination - 페이지네이션 (비용용)
 * 5. TaskExpenseApproval - 비용 결재 문서 목록
 * 6. TaskExpenseApprovalList - 비용 결재 문서 목록 Wrapper
 */

import { APRV_CONSTANTS } from '@/features/aprv';

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 * @param {string} dateStr - ISO 날짜 문자열 또는 LocalDate
 * @returns {string} 포맷된 날짜 (YYYY-MM-DD)
 */
const formatDate = (dateStr) => {
  if (!dateStr) {
    return '';
  }

  try {
    // LocalDate 형식 (YYYY-MM-DD)이 이미 올바른 형식인 경우
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // ISO 형식인 경우 Date 객체로 변환
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    } // 유효하지 않은 날짜

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return dateStr;
  }
};

/**
 * 금액 포맷팅 (천단위 구분자 추가)
 * @param {number|string} amount - 금액
 * @returns {string} 포맷된 금액 (예: "1,000,000")
 */
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return '0';
  }

  try {
    // 숫자로 변환
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // 유효하지 않은 숫자인 경우
    if (isNaN(numAmount)) {
      return '0';
    }

    // 천단위 구분자 추가
    return numAmount.toLocaleString('ko-KR');
  } catch (error) {
    return '0';
  }
};

// ========================================
// 1. 페이지네이션 Entity (휴가용)
// ========================================

/**
 * 휴가 결재 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class TaskVacPagination {
  /**
   * 백엔드 API 응답을 페이지네이션 모델로 변환
   * @param {Object} apiData - API 응답의 페이지네이션 데이터
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @param {number} apiData.totalCount - 전체 데이터 수
   * @returns {Object} 변환된 페이지네이션 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('TaskVacPagination.fromApi: apiData가 필요합니다.');
    }

    return {
      currentPage: apiData.page || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.size || 10,
      totalCount: apiData.totalCount || 0
    };
  }
}

// ========================================
// 2. 휴가 결재 문서 목록 Entity
// ========================================

/**
 * 휴가 결재 문서 Entity 클래스
 * API 응답을 도메인 모델로 변환 (목록 조회용)
 */
export class TaskVacApproval {
  /**
   * 목록 조회 API 응답을 도메인 모델로 변환
   * TaskAprvListODT (휴가 목록) 사용
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.vacTyNm - 휴가 종류
   * @param {string} apiData.aprvSt - 결재 상태 (REQ/TEMP/CMPL/RJCT/WTHD)
   * @param {string} apiData.draftDt - 기안일 (LocalDate)
   * @param {string} apiData.vacStaDt - 휴가 시작일 (LocalDate)
   * @param {string} apiData.vacEndDt - 휴가 종료일 (LocalDate)
   * @param {number} apiData.vacCnt - 휴가 사용일수
   * @param {string} apiData.vacRsn - 휴가 사유
   * @param {string} apiData.aprvTy - 결재유형 코드 (VCT)
   * @returns {Object} 변환된 도메인 모델
   */
  static fromListApi(apiData) {
    if (!apiData) {
      throw new Error('TaskVacApproval.fromListApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      docNo: apiData.docNo,
      vacTyNm: apiData.vacTyNm,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt] || apiData.aprvSt,
      draftDt: apiData.draftDt,
      vacStaDt: apiData.vacStaDtm,
      vacEndDt: apiData.vacEndDtm,
      vacDays: apiData.vacDays,
      vacRsn: apiData.vacRsn,
      approvalType: apiData.aprvTy
    };
  }

  /**
   * 목록 조회 API 응답 배열을 도메인 모델 배열로 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromListApiArray(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('TaskVacApproval.fromListApiArray: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => TaskVacApproval.fromListApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {Object} draft - 도메인 모델 (fromListApi 결과)
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(draft, rowNumber) {
    return {
      id: draft.id,
      rowNumber,
      docNo: draft.docNo, // 문서번호
      vacTyNm: draft.vacTyNm, // 휴가 종류
      aprvSt: draft.statusLabel, // 결재 상태
      draftDt: formatDate(draft.draftDt), // 기안일
      vacStaDt: formatDate(draft.vacStaDt), // 시작일
      vacEndDt: formatDate(draft.vacEndDt), // 종료일
      vacDays: draft.vacDays, // 사용일수
      vacRsn: draft.vacRsn, // 휴가사유
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }
}

// ========================================
// 3. 휴가 결재 문서 목록 Entity (Wrapper)
// ========================================

/**
 * 휴가 결재 문서 목록 Entity 클래스
 * API 응답을 결재 문서 목록 + 페이지네이션 모델로 변환
 */
export class TaskVacApprovalList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * TaskAprvListODT (휴가 목록) 사용
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {Array} apiData.list - 결재 목록
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @param {number} apiData.totalCount - 전체 데이터 수
   * @returns {Object} 변환된 도메인 모델 { list, pagination }
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('TaskVacApprovalList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('TaskVacApprovalList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: TaskVacApproval.fromListApiArray(apiData.list),
      pagination: TaskVacPagination.fromApi(apiData)
    };
  }
}

// ========================================
// 4. 비용 결재 페이지네이션 Entity
// ========================================

/**
 * 비용 결재 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class TaskExpensePagination {
  /**
   * 백엔드 API 응답을 페이지네이션 모델로 변환
   * @param {Object} apiData - API 응답의 페이지네이션 데이터
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @param {number} apiData.totalCount - 전체 데이터 수
   * @returns {Object} 변환된 페이지네이션 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('TaskExpensePagination.fromApi: apiData가 필요합니다.');
    }

    return {
      currentPage: apiData.page || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.size || 10,
      totalCount: apiData.totalCount || 0
    };
  }
}

// ========================================
// 5. 비용 결재 문서 목록 Entity
// ========================================

/**
 * 비용 결재 문서 Entity 클래스
 * API 응답을 도메인 모델로 변환 (목록 조회용)
 */
export class TaskExpenseApproval {
  /**
   * 목록 조회 API 응답을 도메인 모델로 변환
   * TaskAprvListODT (비용 목록) 사용
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.draftDt - 기안일 (LocalDate)
   * @param {string} apiData.expnDt - 사용일 (LocalDate)
   * @param {string} apiData.expnTyNm - 결재 수단
   * @param {number} apiData.payAmt - 금액
   * @param {string} apiData.aprvSt - 결재 상태 (REQ/TEMP/CMPL/RJCT/WTHD)
   * @param {string} apiData.stlDt - 정산일 (LocalDate)
   * @param {string} apiData.expnRsn - 지출사유
   * @param {string} apiData.aprvTy - 결재유형 코드 (EXPN)
   * @returns {Object} 변환된 도메인 모델
   */
  static fromListApi(apiData) {
    if (!apiData) {
      throw new Error('TaskExpenseApproval.fromListApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      docNo: apiData.docNo,
      draftDt: apiData.draftDt,
      expnDt: apiData.expnDt,
      expnTyNm: apiData.expnTyNm,
      payAmt: apiData.payAmt,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt] || apiData.aprvSt,
      stlDt: apiData.stlDt,
      expnRsn: apiData.expnRsn,
      approvalType: apiData.aprvTy
    };
  }

  /**
   * 목록 조회 API 응답 배열을 도메인 모델 배열로 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromListApiArray(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('TaskExpenseApproval.fromListApiArray: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => TaskExpenseApproval.fromListApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {Object} draft - 도메인 모델 (fromListApi 결과)
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(draft, rowNumber) {
    return {
      id: draft.id,
      rowNumber,
      docNo: draft.docNo, // 문서번호
      draftDt: formatDate(draft.draftDt), // 기안일
      expnDt: formatDate(draft.expnDt), // 사용일
      expnTyNm: draft.expnTyNm, // 결재 수단
      payAmt: formatAmount(draft.payAmt), // 금액 (천단위 구분자 적용)
      aprvSt: draft.statusLabel, // 결재 상태
      stlDt: formatDate(draft.stlDt), // 정산일
      expnRsn: draft.expnRsn, // 지출사유
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }
}

// ========================================
// 6. 비용 결재 문서 목록 Entity (Wrapper)
// ========================================

/**
 * 비용 결재 문서 목록 Entity 클래스
 * API 응답을 결재 문서 목록 + 페이지네이션 모델로 변환
 */
export class TaskExpenseApprovalList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * TaskAprvListODT (비용 목록) 사용
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {Array} apiData.list - 결재 목록
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @param {number} apiData.totalCount - 전체 데이터 수
   * @returns {Object} 변환된 도메인 모델 { list, pagination }
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('TaskExpenseApprovalList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('TaskExpenseApprovalList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: TaskExpenseApproval.fromListApiArray(apiData.list),
      pagination: TaskExpensePagination.fromApi(apiData)
    };
  }
}
