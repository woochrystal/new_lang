/**
 * @fileoverview Exec Vac/Expense/General Entity (업무현황 휴가/비용/일반 결재 관련)
 * @description 업무현황 - 휴가현황/비용현황/일반현황 목록 조회용 Entity
 *
 * Entity 포함:
 * 1. ExecVacPagination - 페이지네이션 (휴가용)
 * 2. ExecVacApproval - 휴가 결재 문서 목록
 * 3. ExecVacApprovalList - 휴가 결재 문서 목록 Wrapper
 * 4. ExecExpensePagination - 페이지네이션 (비용용)
 * 5. ExecExpenseApproval - 비용 결재 문서 목록
 * 6. ExecExpenseApprovalList - 비용 결재 문서 목록 Wrapper
 * 7. ExecGeneralPagination - 페이지네이션 (일반용)
 * 8. ExecGeneralApproval - 일반 결재 문서 목록
 * 9. ExecGeneralApprovalList - 일반 결재 문서 목록 Wrapper
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
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
      return '0';
    }
    return numAmount.toLocaleString('ko-KR');
  } catch (error) {
    return '0';
  }
};

// ========================================
// 1. 페이지네이션 Entity (휴가용)
// ========================================

/**
 * 휴가 현황 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class ExecVacPagination {
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
      throw new Error('ExecVacPagination.fromApi: apiData가 필요합니다.');
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
// 2. 휴가 현황 문서 목록 Entity
// ========================================

/**
 * 휴가 현황 문서 Entity 클래스
 * API 응답을 도메인 모델로 변환 (목록 조회용)
 */
export class ExecVacApproval {
  /**
   * 목록 조회 API 응답을 도메인 모델로 변환
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.draftDt - 기안일 (LocalDate)
   * @param {string} apiData.aprvSt - 결재 상태 (REQ/TEMP/CMPL/RJCT/WTHD)
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.aprvTy - 결재유형 코드 (VCT)
   * @param {string} apiData.aprvTyNm - 결재유형명
   * @param {string} apiData.vacTyNm - 휴가 종류
   * @param {string} apiData.vacStaDt - 휴가 시작일 (LocalDate)
   * @param {string} apiData.vacEndDt - 휴가 종료일 (LocalDate)
   * @returns {Object} 변환된 도메인 모델
   */
  static fromListApi(apiData) {
    if (!apiData) {
      throw new Error('ExecVacApproval.fromListApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      draftDt: apiData.draftDt,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt] || apiData.aprvSt,
      createdBy: apiData.draftUsrNm,
      createdByDept: apiData.draftDeptNm,
      docNo: apiData.docNo,
      approvalType: apiData.aprvTy,
      approvalTypeLabel: apiData.aprvTyNm,
      vacTyNm: apiData.vacTyNm,
      vacStaDt: apiData.vacStaDtm,
      vacEndDt: apiData.vacEndDtm
    };
  }

  /**
   * 목록 조회 API 응답 배열을 도메인 모델 배열로 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromListApiArray(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('ExecVacApproval.fromListApiArray: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => ExecVacApproval.fromListApi(item));
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
      aprvSt: draft.statusLabel, // 결재 상태
      draftUsrNm: draft.createdBy, // 기안자
      draftDeptNm: draft.createdByDept, // 기안 부서
      draftDt: formatDate(draft.draftDt), // 기안일
      vacTyNm: draft.vacTyNm, // 휴가 종류
      vacStaDt: formatDate(draft.vacStaDt), // 시작일
      vacEndDt: formatDate(draft.vacEndDt), // 종료일
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }
}

// ========================================
// 3. 휴가 현황 문서 목록 Entity (Wrapper)
// ========================================

/**
 * 휴가 현황 문서 목록 Entity 클래스
 * API 응답을 결재 문서 목록 + 페이지네이션 모델로 변환
 */
export class ExecVacApprovalList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
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
      throw new Error('ExecVacApprovalList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('ExecVacApprovalList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: ExecVacApproval.fromListApiArray(apiData.list),
      pagination: ExecVacPagination.fromApi(apiData)
    };
  }
}

// ========================================
// 4. 비용 현황 페이지네이션 Entity
// ========================================

/**
 * 비용 현황 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class ExecExpensePagination {
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
      throw new Error('ExecExpensePagination.fromApi: apiData가 필요합니다.');
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
// 5. 비용 현황 문서 목록 Entity
// ========================================

/**
 * 비용 현황 문서 Entity 클래스
 * API 응답을 도메인 모델로 변환 (목록 조회용)
 */
export class ExecExpenseApproval {
  /**
   * 목록 조회 API 응답을 도메인 모델로 변환
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.draftDt - 기안일 (LocalDate)
   * @param {string} apiData.aprvSt - 결재 상태 (REQ/TEMP/CMPL/RJCT/WTHD)
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.aprvTy - 결재유형 코드 (EXPN)
   * @param {string} apiData.aprvTyNm - 결재유형명
   * @param {number} apiData.payAmt - 금액
   * @param {string} apiData.stlDt - 정산일 (LocalDate)
   * @param {string} apiData.expnRsn - 지출사유
   * @returns {Object} 변환된 도메인 모델
   */
  static fromListApi(apiData) {
    if (!apiData) {
      throw new Error('ExecExpenseApproval.fromListApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      draftDt: apiData.draftDt,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt] || apiData.aprvSt,
      createdBy: apiData.draftUsrNm,
      createdByDept: apiData.draftDeptNm,
      docNo: apiData.docNo,
      approvalType: apiData.aprvTy,
      approvalTypeLabel: apiData.aprvTyNm,
      payAmt: apiData.payAmt,
      stlDt: apiData.stlDt,
      expnRsn: apiData.expnRsn
    };
  }

  /**
   * 목록 조회 API 응답 배열을 도메인 모델 배열로 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromListApiArray(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('ExecExpenseApproval.fromListApiArray: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => ExecExpenseApproval.fromListApi(item));
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
      aprvSt: draft.statusLabel, // 결재 상태
      draftUsrNm: draft.createdBy, // 기안자
      draftDeptNm: draft.createdByDept, // 기안 부서
      draftDt: formatDate(draft.draftDt), // 기안일
      payAmt: formatAmount(draft.payAmt), // 금액 (천단위 구분자)
      stlDt: formatDate(draft.stlDt), // 정산일
      expnRsn: draft.expnRsn, // 지출사유
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }
}

// ========================================
// 6. 비용 현황 문서 목록 Entity (Wrapper)
// ========================================

/**
 * 비용 현황 문서 목록 Entity 클래스
 * API 응답을 결재 문서 목록 + 페이지네이션 모델로 변환
 */
export class ExecExpenseApprovalList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
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
      throw new Error('ExecExpenseApprovalList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('ExecExpenseApprovalList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: ExecExpenseApproval.fromListApiArray(apiData.list),
      pagination: ExecExpensePagination.fromApi(apiData)
    };
  }
}

// ========================================
// 7. 일반 현황 페이지네이션 Entity
// ========================================

/**
 * 일반 현황 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class ExecGeneralPagination {
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
      throw new Error('ExecGeneralPagination.fromApi: apiData가 필요합니다.');
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
// 8. 일반 현황 문서 목록 Entity
// ========================================

/**
 * 일반 현황 문서 Entity 클래스
 * API 응답을 도메인 모델로 변환 (목록 조회용)
 */
export class ExecGeneralApproval {
  /**
   * 목록 조회 API 응답을 도메인 모델로 변환
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.draftDt - 기안일 (LocalDate)
   * @param {string} apiData.aprvSt - 결재 상태 (REQ/TEMP/CMPL/RJCT/WTHD)
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.aprvTy - 결재유형 코드 (GNRL)
   * @param {string} apiData.aprvTyNm - 결재유형명
   * @returns {Object} 변환된 도메인 모델
   */
  static fromListApi(apiData) {
    if (!apiData) {
      throw new Error('ExecGeneralApproval.fromListApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      draftDt: apiData.draftDt,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt] || apiData.aprvSt,
      createdBy: apiData.draftUsrNm,
      createdByDept: apiData.draftDeptNm,
      docNo: apiData.docNo,
      approvalType: apiData.aprvTy,
      approvalTypeLabel: apiData.aprvTyNm,
      aprvTitle: apiData.aprvTitle
    };
  }

  /**
   * 목록 조회 API 응답 배열을 도메인 모델 배열로 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromListApiArray(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('ExecGeneralApproval.fromListApiArray: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => ExecGeneralApproval.fromListApi(item));
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
      aprvSt: draft.statusLabel, // 결재 상태
      draftUsrNm: draft.createdBy, // 기안자
      draftDeptNm: draft.createdByDept, // 기안 부서
      draftDt: formatDate(draft.draftDt), // 기안일
      aprvTitle: draft.aprvTitle, // 제목
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }
}

// ========================================
// 9. 일반 현황 문서 목록 Entity (Wrapper)
// ========================================

/**
 * 일반 현황 문서 목록 Entity 클래스
 * API 응답을 결재 문서 목록 + 페이지네이션 모델로 변환
 */
export class ExecGeneralApprovalList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
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
      throw new Error('ExecGeneralApprovalList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('ExecGeneralApprovalList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: ExecGeneralApproval.fromListApiArray(apiData.list),
      pagination: ExecGeneralPagination.fromApi(apiData)
    };
  }
}
