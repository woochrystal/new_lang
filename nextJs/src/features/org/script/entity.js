/**
 * @fileoverview Organization 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 조직 단일 항목
 * @typedef {Object} ApiOrganization
 * @property {number} dept_id - 고유 ID
 * @property {number} tenant_id - 테넌트 ID
 * @property {string} dept_depth - 조직 깊이
 * @property {string} dept_nm - 조직 이름
 * @property {number} dept_ord - 정렬 순서
 * @property {number|null} upp_dept_id - 상위 조직 ID
 * @property {string} del_yn - 삭제 여부 ('Y' | 'N')
 * @property {string} reg_dtm - 등록일시
 * @property {string} upd_dtm - 수정일시
 */

/**
 * API 응답 - 조직원
 * @typedef {Object} ApiOrganizationMember
 * @property {number} usr_id - 사용자 ID
 * @property {string} usr_nm - 사용자 이름
 * @property {number} dept_id - 부서 ID
 * @property {string} dept_nm - 부서 이름
 * @property {number} pos_id - 직급 ID
 * @property {number} pos_nm - 직급 이름
 * @property {string} usr_tel - 연락처
 * @property {string} email - 이메일
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 조직
 * @typedef {Object} OrganizationEntity
 * @property {number} id - 조직 고유 ID
 * @property {string} deptNm - 조직 이름
 * @property {number} deptOrd - 정렬 순서
 * @property {string} deptDepth - 조직 깊이
 * @property {number|null} uppDeptId - 상위 조직 ID
 * @property {'published'|'deleted'} status - 조직 상태
 * @property {string} createdAt - 등록일시
 * @property {string} updatedAt - 수정일시
 */

/**
 * 조직 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Organization {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiOrganization} apiData - 백엔드 API 응답 데이터
   * @returns {OrganizationEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Organization.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.dept_id || apiData.deptId || '',
      deptNm: apiData.dept_nm || apiData.deptNm || '',
      deptOrd: apiData.dept_ord ?? apiData.deptOrd ?? 0,
      deptDepth: apiData.dept_depth || apiData.deptDepth || '0',
      uppDeptId: apiData.upp_dept_id ?? apiData.uppDeptId ?? null,
      status: apiData.delYn === 'N' ? 'published' : 'deleted',
      createdAt: apiData.regDtm ? apiData.regDtm.replace('T', ' ') : '',
      updatedAt: apiData.updDtm ? apiData.updDtm.replace('T', ' ') : ''
    };
  }

  /**
   * 조직 목록을 변환
   * @param {ApiOrganization[]} apiList - 백엔드 API 응답 목록
   * @returns {OrganizationEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Organization.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Organization.fromApi(item));
  }

  /**
   * 조직원 정보 변환
   * @param {ApiOrganizationMember} apiData - 조직원 API 응답
   * @returns {Object} 변환된 조직원 정보
   */
  static fromApiMember(apiData) {
    return {
      usrId: apiData.usr_id || apiData.usrId,
      usrNm: apiData.usr_nm || apiData.usrNm,
      deptId: apiData.dept_id || apiData.deptId,
      deptNm: apiData.dept_nm || apiData.deptNm,
      posId: apiData.pos_id || apiData.posId,
      posNm: apiData.pos_nm || apiData.posNm,
      usrTel: apiData.usr_tel || apiData.usrTel,
      email: apiData.email
    };
  }

  /**
   * 조직원 목록 변환
   * @param {ApiOrganizationMember[]} apiList - 조직원 목록
   * @returns {Object[]} 변환된 조직원 목록
   */
  static fromApiMemberList(apiList) {
    if (!Array.isArray(apiList)) {
      return [];
    }
    return apiList.map((item) => Organization.fromApiMember(item));
  }
}
