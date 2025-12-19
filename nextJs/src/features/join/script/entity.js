/**
 * @fileoverview Join 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들 (JoinODT 기반)
 */

// ============================================
// API 응답 타입 정의 (JoinODT 필드 기반)
// ============================================

/**
 * API 응답 - 가입 신청 단일 항목 (JoinODT)
 * @typedef {Object} ApiJoin
 * @property {number} join_id - 가입 고유 ID
 * @property {string} domain_path - 도메인 경로
 * @property {string} tenant_nm - 기업 이름
 * @property {string} login_id - 관리자 로그인 아이디
 * @property {string} join_st - 가입 상태
 * @property {string} bsns_reg_no - 사업자등록번호
 * @property {string} tenant_tel - 기업 전화번호
 * @property {string} addr - 주소
 * @property {string} mgr_email - 관리자 이메일
 * @property {string} mgr_nm - 관리자 이름
 * @property {string} mgr_tel - 관리자 전화번호
 * @property {string} del_yn - 삭제 여부 ('Y' | 'N')
 * @property {string} reg_dtm - 등록일시 (LocalDateTime)
 * @property {string} upd_dtm - 수정일시 (LocalDateTime)
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 가입 신청
 * @typedef {Object} JoinEntity
 * @property {number} joinId - 가입 고유 ID
 * @property {string} domainPath - 도메인 경로
 * @property {string} tenantNm - 기업 이름
 * @property {string} loginId - 관리자 로그인 아이디
 * @property {string} joinStatus - 가입 상태
 * @property {string} bsnsRegNo - 사업자등록번호
 * @property {string} tenantTel - 기업 전화번호
 * @property {string} address - 주소
 * @property {string} mgrEmail - 관리자 이메일
 * @property {string} mgrName - 관리자 이름
 * @property {string} mgrTel - 관리자 전화번호
 * @property {boolean} isDeleted - 삭제 여부
 * @property {string} createdAt - 등록일시
 * @property {string} updatedAt - 수정일시
 */

/**
 * 가입 신청 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Join {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiJoin} apiData - 백엔드 API 응답 데이터 (snake_case 또는 camelCase 혼용 가능성 대비)
   * @returns {JoinEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Join.fromApi: apiData가 필요합니다.');
    }

    return {
      joinId: apiData.join_id || apiData.joinId,
      domainPath: apiData.domain_path || apiData.domainPath || '',
      tenantNm: apiData.tenant_nm || apiData.tenantNm || '',
      loginId: apiData.login_id || apiData.loginId || '',
      joinStatus: apiData.join_st || apiData.joinSt || '',
      bsnsRegNo: apiData.bsns_reg_no || apiData.bsnsRegNo || '',
      tenantTel: apiData.tenant_tel || apiData.tenantTel || '',
      address: apiData.addr || '',
      mgrEmail: apiData.mgr_email || apiData.mgrEmail || '',
      mgrName: apiData.mgr_nm || apiData.mgrNm || '',
      mgrTel: apiData.mgr_tel || apiData.mgrTel || '',
      isDeleted: apiData.del_yn === 'Y' || apiData.delYn === 'Y',
      createdAt: apiData.reg_dtm ? apiData.reg_dtm.replace('T', ' ') : apiData.regDtm || '',
      updatedAt: apiData.upd_dtm ? apiData.upd_dtm.replace('T', ' ') : apiData.updDtm || ''
    };
  }

  /**
   * 가입 신청 목록을 변환
   * @param {ApiJoin[]} apiList - 백엔드 API 응답 목록
   * @returns {JoinEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Join.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Join.fromApi(item));
  }
}
