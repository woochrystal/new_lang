/**
 * @fileoverview Position 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 직급 단일 항목
 * @typedef {Object} ApiPosition
 * @property {number} posId - 고유 ID (pos_id)
 * @property {string} posNm - 직급 이름 (pos_nm)
 * @property {number} posOrd - 정렬 순서 (pos_ord)
 * @property {string} delYn - 삭제 여부 ('Y' | 'N') (del_yn)
 * @property {number} tenantId - 테넌트 ID (tenant_id)
 * @property {string} regDtm - 작성일시 (ISO 8601 또는 'YYYY-MM-DD HH:mm:ss' 형식) (reg_dtm)
 * @property {string} updDtm - 수정일시 (ISO 8601 또는 'YYYY-MM-DD HH:mm:ss' 형식) (upd_dtm)
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 직급
 * @typedef {Object} PositionEntity
 * @property {number} id - 직급 고유 ID (posId)
 * @property {string} posNm - 직급 이름 (posNm)
 * @property {number} posOrd - 정렬 순서 (posOrd)
 * @property {'published'|'deleted'} status - 직급 상태
 * @property {string} createdAt - 등록일시 (ISO 8601 형식)
 * @property {string} updatedAt - 수정일시 (ISO 8601 형식)
 */

/**
 * 도메인 엔티티 - 직급 목록
 * @typedef {Object} PositionListEntity
 * @property {PositionEntity[]} list - 직급 목록
 */

/**
 * 직급 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Position {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiPosition} apiData - 백엔드 API 응답 데이터
   * @returns {PositionEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Position.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.pos_id || apiData.posId || '',
      posNm: apiData.pos_nm || apiData.posNm || '',
      posOrd: apiData.pos_ord ?? apiData.posOrd ?? 0,
      status: apiData.del_yn === 'N' ? 'published' : 'deleted',
      createdAt: apiData.reg_dtm ? apiData.reg_dtm.replace('T', ' ') : '',
      updatedAt: apiData.upd_dtm ? apiData.upd_dtm.replace('T', ' ') : ''
    };
  }

  /**
   * 직급 목록을 변환
   * @param {ApiPosition[]} apiList - 백엔드 API 응답 목록
   * @returns {PositionEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Position.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Position.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {PositionEntity} position - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(position, rowNumber) {
    return {
      id: position.id,
      rowNumber,
      posNm: position.posNm,
      posOrd: position.posOrd,
      originalItem: position
    };
  }
}
