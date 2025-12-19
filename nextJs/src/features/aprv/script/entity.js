/**
 * @fileoverview Approval 관련 Entity 클래스 및 API 응답 변환
 * @description 백엔드 API 응답(ODT)을 프론트엔드 도메인 모델로 변환
 *
 * Entity 순서:
 * 1. 페이지네이션
 * 2. 결재 문서 목록 (MyBox, PendingBox, Status)
 * 3. 결재 문서 상세 (Vacation, General, Expense)
 * 4. 결재 문서 목록 Wrapper
 */

import { APRV_CONSTANTS } from './constants';
import { formatDate } from './utils';

// ========================================
// 1. 페이지네이션 Entity
// ========================================

/**
 * 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class Pagination {
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
      throw new Error('Pagination.fromApi: apiData가 필요합니다.');
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
// 2. 결재 문서 목록 Entity
// ========================================

/**
 * 결재 문서 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class ApprovalDraft {
  /**
   * 목록 조회 API 응답을 도메인 모델로 변환
   * MyBoxODT, PendingBoxODT, StatusODT 공통 사용
   *
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.draftDt - 기안일 (LocalDate)
   * @param {string} apiData.aprvSt - 결재 상태 (REQ/TEMP/CMPL/RJCT/WTHD)
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.aprvTy - 결재유형 코드 (GENE/VCT/EXPN)
   * @param {string} apiData.aprvTyNm - 결재유형명
   * @returns {Object} 변환된 도메인 모델
   */
  static fromListApi(apiData) {
    if (!apiData) {
      throw new Error('ApprovalDraft.fromListApi: apiData가 필요합니다.');
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
      approvalTypeLabel: apiData.aprvTyNm
    };
  }

  /**
   * 목록 조회 API 응답 배열을 도메인 모델 배열로 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromListApiArray(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('ApprovalDraft.fromListApiArray: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => ApprovalDraft.fromListApi(item));
  }

  /**
   * 내 결재함 테이블 표시용 데이터로 변환
   * @param {Object} draft - 도메인 모델 (fromListApi 결과)
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터 (myBox 전용: 4개 컬럼)
   */
  static toMyBoxTableRow(draft, rowNumber) {
    return {
      id: draft.id,
      rowNumber,
      docNo: draft.docNo, // 문서번호
      aprvTyNm: draft.approvalTypeLabel, // 결재 유형명
      aprvSt: draft.statusLabel, // 결재 상태
      draftDt: formatDate(draft.draftDt), // 기안일
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }

  /**
   * 결재대기 테이블 표시용 데이터로 변환
   * @param {Object} draft - 도메인 모델 (fromListApi 결과)
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터 (pendingBox 전용: 6개 컬럼)
   */
  static toPendingBoxTableRow(draft, rowNumber) {
    return {
      id: draft.id,
      rowNumber,
      docNo: draft.docNo, // 문서번호
      aprvTyNm: draft.approvalTypeLabel, // 결재 유형명
      aprvSt: draft.statusLabel, // 결재 상태
      draftUsrNm: draft.createdBy, // 기안자
      draftDeptNm: draft.createdByDept, // 기안 부서
      draftDt: formatDate(draft.draftDt), // 기안일
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }

  /**
   * 결재현황 테이블 표시용 데이터로 변환
   * @deprecated status 페이지에서 사용 (APRV_BOX_COLUMN 미정의 이슈 있음)
   * @param {Object} draft - 도메인 모델 (fromListApi 결과)
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(draft, rowNumber) {
    return {
      id: draft.id,
      rowNumber,
      docNo: draft.docNo, // 문서번호
      aprvTyNm: draft.approvalTypeLabel, // 결재 유형명
      aprvSt: draft.statusLabel, // 결재 상태
      draftUsrNm: draft.createdBy, // 기안자
      draftDeptNm: draft.createdByDept, // 기안 부서
      draftDt: formatDate(draft.draftDt), // 기안일
      approvalType: draft.approvalType, // 결재 유형 코드 (라우팅용)
      originalItem: draft
    };
  }

  // ========================================
  // 3. 결재 문서 상세 Entity
  // ========================================

  /**
   * 휴가 결재 상세 조회 API 응답을 도메인 모델로 변환
   * VctAprvODT → Domain Model
   *
   * @param {Object} apiData - 백엔드 휴가 결재 상세 조회 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.aprvTy - 결재 유형 코드 ('VCT')
   * @param {string} apiData.aprvTyNm - 결재 유형명
   * @param {string} apiData.aprvSt - 결재 상태
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.draftDt - 기안일
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.vacTy - 휴가 유형 코드
   * @param {string} apiData.vacTyNm - 휴가 유형명
   * @param {string} apiData.vacStaDt - 휴가 시작일
   * @param {string} apiData.vacEndDt - 휴가 종료일
   * @param {number} apiData.vacDays - 휴가 일수
   * @param {string} apiData.vacRsn - 휴가 사유
   * @param {string} apiData.emgTel - 비상연락처
   * @param {number} apiData.subId - 대무자 ID
   * @param {string} apiData.subNm - 대무자명
   * @param {string} apiData.trfNote - 인수인계사항
   * @param {Array<ApprovalLineODT>} apiData.approvalLine - 결재선
   * @returns {Object} 변환된 도메인 모델
   */
  static fromVacationDetailApi(apiData) {
    if (!apiData) {
      throw new Error('ApprovalDraft.fromVacationDetailApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      approvalType: 'VCT',
      approvalTypeLabel: apiData.aprvTyNm,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt],
      docNo: apiData.docNo,
      draftDt: apiData.draftDt,
      createdBy: apiData.draftUsrNm,
      createdByDept: apiData.draftDeptNm,
      // 휴가 특화 필드
      vacTy: apiData.vacTy,
      vacTyNm: apiData.vacTyNm,
      vacStaDt: apiData.vacStaDt,
      vacEndDt: apiData.vacEndDt,
      vacDays: apiData.vacDays,
      vacRsn: apiData.vacRsn,
      emgTel: apiData.emgTel,
      subNm: apiData.subNm,
      subId: apiData.subId,
      trfNote: apiData.trfNote,
      // 결재선
      approvalLine:
        apiData.approvalLine?.map((line) => ({
          usrId: line.aprvUsrId,
          usrNm: line.usrNm,
          deptNm: line.deptNm,
          posNm: line.posNm,
          aprvStep: line.aprvStep,
          aprvSt: line.aprvSt,
          aprvStNm: APRV_CONSTANTS.STATUS_LABEL[line.aprvSt],
          aprvDtm: line.aprvDtm,
          aprvCmt: line.aprvCmt
        })) || []
    };
  }

  /**
   * 일반 결재 상세 조회 API 응답을 도메인 모델로 변환
   * GeneAprvODT → Domain Model
   *
   * @param {Object} apiData - 백엔드 일반 결재 상세 조회 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.aprvTy - 결재 유형 코드 ('GENE')
   * @param {string} apiData.aprvTyNm - 결재 유형명
   * @param {string} apiData.aprvSt - 결재 상태
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.draftDt - 기안일
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.aprvTitle - 결재 제목
   * @param {string} apiData.aprvCtt - 결재 내용
   * @param {number} apiData.fileId - 파일 ID
   * @param {Array} apiData.fileList - 파일 목록
   * @param {Array<ApprovalLineODT>} apiData.approvalLine - 결재선
   * @returns {Object} 변환된 도메인 모델
   */
  static fromGeneralDetailApi(apiData) {
    if (!apiData) {
      throw new Error('ApprovalDraft.fromGeneralDetailApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      approvalType: 'GENE',
      approvalTypeLabel: apiData.aprvTyNm,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt],
      docNo: apiData.docNo,
      draftDt: apiData.draftDt,
      createdBy: apiData.draftUsrNm,
      createdByDept: apiData.draftDeptNm,
      // 일반 결재 특화 필드
      aprvTitle: apiData.aprvTitle,
      aprvCtt: apiData.aprvCtt,
      fileId: apiData.fileId,
      fileList: apiData.fileList || [],
      // 결재선
      approvalLine:
        apiData.approvalLine?.map((line) => ({
          usrId: line.aprvUsrId,
          usrNm: line.usrNm,
          deptNm: line.deptNm,
          posNm: line.posNm,
          aprvStep: line.aprvStep,
          aprvSt: line.aprvSt,
          aprvStNm: APRV_CONSTANTS.STATUS_LABEL[line.aprvSt],
          aprvDtm: line.aprvDtm,
          aprvCmt: line.aprvCmt
        })) || []
    };
  }

  /**
   * 비용 결재 상세 조회 API 응답을 도메인 모델로 변환
   * ExpnAprvODT → Domain Model
   *
   * @param {Object} apiData - 백엔드 비용 결재 상세 조회 API 응답 데이터
   * @param {number} apiData.aprvId - 결재 ID
   * @param {string} apiData.aprvTy - 결재 유형 코드 ('EXPN')
   * @param {string} apiData.aprvTyNm - 결재 유형명
   * @param {string} apiData.aprvSt - 결재 상태
   * @param {string} apiData.docNo - 문서번호
   * @param {string} apiData.draftDt - 기안일
   * @param {string} apiData.draftUsrNm - 기안자명
   * @param {string} apiData.draftDeptNm - 기안부서명
   * @param {string} apiData.expnTy - 비용 유형 코드
   * @param {string} apiData.expnTyNm - 비용 유형명
   * @param {string} apiData.expnDt - 비용 사용일자
   * @param {number} apiData.payAmt - 결제 금액
   * @param {string} apiData.cardNo - 카드번호
   * @param {string} apiData.expnRsn - 비용 사유
   * @param {number} apiData.fileId - 파일 ID
   * @param {Array} apiData.fileList - 파일 목록
   * @param {Array<ApprovalLineODT>} apiData.approvalLine - 결재선
   * @returns {Object} 변환된 도메인 모델
   */
  static fromExpenseDetailApi(apiData) {
    if (!apiData) {
      throw new Error('ApprovalDraft.fromExpenseDetailApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.aprvId,
      approvalType: 'EXPN',
      approvalTypeLabel: apiData.aprvTyNm,
      status: apiData.aprvSt,
      statusLabel: APRV_CONSTANTS.STATUS_LABEL[apiData.aprvSt],
      docNo: apiData.docNo,
      draftDt: apiData.draftDt,
      createdBy: apiData.draftUsrNm,
      createdByDept: apiData.draftDeptNm,
      // 비용 결재 특화 필드
      expnTy: apiData.expnTy,
      expnTyNm: apiData.expnTyNm,
      expnDt: apiData.expnDt,
      payAmt: apiData.payAmt,
      cardNo: apiData.cardNo,
      expnRsn: apiData.expnRsn,
      fileId: apiData.fileId,
      fileList: apiData.fileList || [],
      // 결재선
      approvalLine:
        apiData.approvalLine?.map((line) => ({
          usrId: line.aprvUsrId,
          usrNm: line.usrNm,
          deptNm: line.deptNm,
          posNm: line.posNm,
          aprvStep: line.aprvStep,
          aprvSt: line.aprvSt,
          aprvStNm: APRV_CONSTANTS.STATUS_LABEL[line.aprvSt],
          aprvDtm: line.aprvDtm,
          aprvCmt: line.aprvCmt
        })) || []
    };
  }
}

// ========================================
// 4. 결재 문서 목록 Entity (Wrapper)
// ========================================

/**
 * 결재 문서 목록 Entity 클래스
 * API 응답을 결재 문서 목록 + 페이지네이션 모델로 변환
 */
export class ApprovalDraftList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * MyBoxListODT, PendingBoxListODT, StatusListODT 공통 사용
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
      throw new Error('ApprovalDraftList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('ApprovalDraftList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: ApprovalDraft.fromListApiArray(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
