/**
 * @fileoverview Board 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

import { formatDate } from './utils';

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 게시글 단일 항목
 * @typedef {Object} ApiBoard
 * @property {number} smpId - 게시글 고유 ID
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 * @property {string} regId - 작성자 ID
 * @property {string} regDtm - 작성일시 (ISO 8601 형식)
 * @property {string} updDtm - 수정일시 (ISO 8601 형식)
 * @property {string} delYn - 삭제 여부 ('Y' | 'N')
 * @property {number|null} fileId - 첨부파일 ID (선택)
 */

/**
 * API 응답 - 게시글 목록
 * @typedef {Object} ApiBoardList
 * @property {ApiBoard[]} list - 게시글 목록
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalCount - 전체 게시글 수
 * @property {number} totalPages - 전체 페이지 수
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 게시글
 * @typedef {Object} BoardEntity
 * @property {number} id - 게시글 고유 ID
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 * @property {string} author - 작성자 ID
 * @property {string} createdAt - 작성일시 (ISO 8601 형식)
 * @property {string} updatedAt - 수정일시 (ISO 8601 형식)
 * @property {'published'|'deleted'} status - 게시글 상태
 * @property {number|null} fileId - 첨부파일 ID
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
 * 도메인 엔티티 - 게시글 목록 (페이지네이션 포함)
 * @typedef {Object} BoardListEntity
 * @property {BoardEntity[]} list - 게시글 목록
 * @property {PaginationEntity} pagination - 페이지네이션 정보
 */

/**
 * 게시글 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Board {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiBoard} apiData - 백엔드 API 응답 데이터
   * @returns {BoardEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Board.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.smpId,
      title: apiData.title || '',
      content: apiData.content || '',
      author: apiData.regId || '',
      createdAt: apiData.regDtm || '',
      updatedAt: apiData.updDtm || apiData.regDtm || '',
      status: apiData.delYn === 'N' ? 'published' : 'deleted',
      fileId: apiData.fileId || null
    };
  }

  /**
   * 게시글 목록을 변환
   * @param {ApiBoard[]} apiList - 백엔드 API 응답 목록
   * @returns {BoardEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Board.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Board.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {BoardEntity} board - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(board, rowNumber) {
    return {
      id: board.id,
      rowNumber,
      title: board.title,
      createdAt: formatDate(board.createdAt),
      originalItem: board
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
 * 게시글 목록 Entity 클래스
 * API 응답을 게시글 목록 모델로 변환
 */
export class BoardList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiBoardList} apiData - 백엔드 API 응답 데이터
   * @returns {BoardListEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('BoardList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('BoardList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: Board.fromApiList(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
