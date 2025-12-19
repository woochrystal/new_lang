/**
 * @fileoverview Partner 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 협력사 목록
 * @typedef {Object} ApiPartnerList
 * @property {ApiPartner[]} list - 협력사 목록
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalCount - 전체 협력사 수
 * @property {number} totalPages - 전체 페이지 수
 */

/**
 * API 응답 - 협력사 단일 항목
 * @typedef {Object} ApiPartner
 * @property {number} ptnrId - 게시글 고유 ID
 * @property {string} ptnrNm - 협력사 이름
 * @property {string} ceoNm - 대표자 이름
 * @property {string} mainSvc - 주요서비스
 * @property {date} cntrtStaDt - 계약시작일
 * @property {number} bsnsRegNo - 사업자등록번호
 * @property {string} mainMgr - 담당자 이름
 * @property {string} mgrTel - 담당자 전화번호
 * @property {number|null} fileId - 첨부파일 ID (선택)
 * @property {list} fileList - 첨부파일 리스트 (선택)
 * @property {string} note - 비고
 * @property {string} delYn - 삭제 여부 ('Y' | 'N')
 * @property {string} regId - 작성자 ID
 * @property {string} regDtm - 작성일시 (ISO 8601 형식)
 * @property {string} updId - 수정자 ID
 * @property {string} updDtm - 수정일시 (ISO 8601 형식)
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 협력사
 * @typedef {Object} PartnerEntity
 * @property {number} id - 협력사 고유 ID
 * @property {string} ptnrNm - 협력사 이름
 * @property {string} ceoNm - 대표자 이름
 * @property {string} mainSvc - 주요서비스
 * @property {date} cntrtStaDt - 계약시작일
 * @property {number} bsnsRegNo - 사업자등록번호
 * @property {string} mainMgr - 담당자 이름
 * @property {string} mgrTel - 담당자 전화번호
 * @property {number|null} fileId - 첨부파일 ID
 * @property {list} fileList - 첨부파일 리스트
 * @property {string} note - 비고
 * @property {'published'|'deleted'} status - 협력사 상태
 * @property {string} createdAt - 등록일시 (ISO 8601 형식)
 */

/**
 * 도메인 엔티티 - 페이지네이션 정보
 * @typedef {Object} PaginationEntity
 * @property {number} currentPage - 현재 페이지 번호
 * @property {number} totalPages - 전체 페이지 수
 * @property {number} pageSize - 페이지 크기
 * @property {number} totalCount - 전체 항목 수
 */

/**
 * 도메인 엔티티 - 협력사 목록 (페이지네이션 포함)
 * @typedef {Object} PartnerListEntity
 * @property {PartnerEntity[]} list - 협력사 목록
 * @property {PaginationEntity} pagination - 페이지네이션 정보
 */

/**
 * 협력사 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Partner {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiPartner} apiData - 백엔드 API 응답 데이터
   * @returns {PartnerEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Partner.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.ptnr_id || apiData.ptnrId,
      ptnrNm: apiData.ptnr_nm || apiData.ptnrNm || '',
      ceoNm: apiData.ceo_nm || apiData.ceoNm || '',
      mainSvc: apiData.main_svc || apiData.mainSvc || '',
      cntrtStaDt: apiData.cntrt_sta_dt || apiData.cntrtStaDt || null,
      bsnsRegNo: apiData.bsns_reg_no || apiData.bsnsRegNo || '',
      mainMgr: apiData.main_mgr || apiData.mainMgr || '',
      mgrTel: apiData.mgr_tel || apiData.mgrTel || '',
      fileId: apiData.file_id || apiData.fileId || null,
      fileList: apiData.file_list || apiData.fileList || [],
      note: apiData.note || '',
      status: apiData.delYn === 'N' ? 'published' : 'deleted',
      createdAt: apiData.reg_dtm || apiData.regDtm || ''
    };
  }

  /**
   * 협력사 목록을 변환
   * @param {ApiPartner[]} apiList - 백엔드 API 응답 목록
   * @returns {PartnerEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Partner.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Partner.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {PartnerEntity} partner - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(partner, rowNumber) {
    return {
      id: partner.id,
      rowNumber,
      createdAt: partner.createdAt,
      ptnrNm: partner.ptnrNm,
      ceoNm: partner.ceoNm,
      bsnsRegNo: partner.bsnsRegNo,
      mainSvc: partner.mainSvc,
      originalItem: partner
    };
  }
}

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
   * @param {number} apiData.totalCount - 전체 항목 수
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @returns {PaginationEntity} 변환된 페이지네이션 모델
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

  /**
   * 이전 페이지 존재 여부
   * @param {PaginationEntity} pagination
   * @returns {boolean}
   */
  static hasPrevious(pagination) {
    return pagination.currentPage > 1;
  }

  /**
   * 다음 페이지 존재 여부
   * @param {PaginationEntity} pagination
   * @returns {boolean}
   */
  static hasNext(pagination) {
    return pagination.currentPage < pagination.totalPages;
  }
}

/**
 * 협력사 목록 Entity 클래스
 * API 응답을 협력사 목록 모델로 변환
 */
export class PartnerList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiPartnerList} apiData - 백엔드 API 응답 데이터
   * @returns {PartnerListEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('PartnerList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('PartnerList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: Partner.fromApiList(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
