/**
 * @fileoverview Role 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 권한 단일 항목
 * @typedef {Object} ApiRole
 * @property {number} auth_id - 권한 고유 ID
 * @property {number} tenant_id - 테넌트 ID
 * @property {string} auth_nm - 권한 이름
 * @property {string} auth_desc - 권한 설명
 * @property {number} usr_cnt - 사용자 수
 * @property {string} del_yn - 삭제 여부 ('Y' | 'N')
 * @property {string} reg_dtm - 등록일시
 * @property {string} upd_dtm - 수정일시
 */

/**
 * API 응답 - 메뉴
 * @typedef {Object} ApiRoleMenu
 * @property {number} menu_id - 메뉴 ID
 * @property {string} menu_nm - 메뉴 이름
 * @property {number|null} upp_menu_id - 상위 메뉴 ID
 * @property {string} menu_url - 메뉴 URL
 * @property {string} menu_depth - 메뉴 깊이
 * @property {number} menu_ord - 정렬 순서
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 권한
 * @typedef {Object} RoleEntity
 * @property {number} authId - 권한 고유 ID
 * @property {number} tenantId - 테넌트 ID
 * @property {string} authNm - 권한 이름
 * @property {string} authDesc - 권한 설명
 * @property {number} usrCnt - 사용자 수
 * @property {'published'|'deleted'} status - 권한 상태
 * @property {string} createdAt - 등록일시
 * @property {string} updatedAt - 수정일시
 */

/**
 * 권한 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Role {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiRole} apiData - 백엔드 API 응답 데이터
   * @returns {RoleEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Role.fromApi: apiData가 필요합니다.');
    }

    return {
      authId: apiData.auth_id || apiData.authId,
      tenantId: apiData.tenant_id || apiData.tenantId,
      authNm: apiData.auth_nm || apiData.authNm || '',
      authDesc: apiData.auth_desc || apiData.authDesc || '',
      usrCnt: apiData.usr_cnt ?? apiData.usrCnt ?? 0,
      status: apiData.del_yn === 'N' || apiData.delYn === 'N' ? 'published' : 'deleted',
      createdAt: apiData.reg_dtm ? apiData.reg_dtm.replace('T', ' ') : apiData.regDtm || '',
      updatedAt: apiData.upd_dtm ? apiData.upd_dtm.replace('T', ' ') : apiData.updDtm || ''
    };
  }

  /**
   * 권한 목록을 변환
   * @param {ApiRole[]} apiList - 백엔드 API 응답 목록
   * @returns {RoleEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Role.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Role.fromApi(item));
  }

  /**
   * 메뉴 정보 변환
   * @param {ApiRoleMenu} apiData - 메뉴 API 응답
   * @returns {Object} 변환된 메뉴 정보
   */
  static fromApiMenu(apiData) {
    return {
      menuId: apiData.menu_id || apiData.menuId,
      menuNm: apiData.menu_nm || apiData.menuNm,
      uppMenuId: apiData.upp_menu_id ?? apiData.uppMenuId ?? null,
      menuUrl: apiData.menu_url || apiData.menuUrl || '',
      menuDepth: apiData.menu_depth || apiData.menuDepth || '0',
      menuOrd: apiData.menu_ord ?? apiData.menuOrd ?? 0
    };
  }

  /**
   * 메뉴 목록 변환
   * @param {ApiRoleMenu[]} apiList - 메뉴 목록
   * @returns {Object[]} 변환된 메뉴 목록
   */
  static fromApiMenuList(apiList) {
    if (!Array.isArray(apiList)) {
      return [];
    }
    return apiList.map((item) => Role.fromApiMenu(item));
  }
}
