/*
 * path           : src/shared/api/mock/mockData/index.js
 * fileName       : mockData (index)
 * author         : changhyeon
 * date           : 25. 11. 12.
 * description    : Mock 데이터 통합 export (도메인별 모듈 조합)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 12.       changhyeon       도메인별 분리 후 통합 export
 */

import { aprvTemplates, myBoxDrafts, pendingBoxDrafts, statusDrafts, aprvLines } from './approval';
import { boards } from './board';
import { menus } from './menu';
import { user, tenant, companyInfo } from './system';

/**
 * Mock 데이터베이스
 *
 * 도메인별로 분리된 모듈에서 데이터를 import하여
 * 스프레드 연산자로 통합합니다.
 *
 * 각 도메인:
 * - system.js: user, tenant (시스템 초기화용)
 * - menu.js: menus (네비게이션 메뉴)
 * - approval.js: 결재 관련 5개 엔티티
 * - board.js: 게시판 데이터
 */
export const mockDatabase = {
  // 시스템/인증
  user,
  tenant,
  companyInfo,

  // 메뉴
  menus,

  // 전자결재
  aprvTemplates,
  myBoxDrafts,
  pendingBoxDrafts,
  statusDrafts,
  aprvLines,

  // 게시판
  boards
};

// 편의: 전체 export
export default mockDatabase;
