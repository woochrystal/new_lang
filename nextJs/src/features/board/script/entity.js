/**
 * @fileoverview Board 관련 Entity 클래스 및 API 타입 정의
 * @description 백엔드 API로부터 받은 데이터를 프론트엔드에서 사용하기 쉬운 형태로 변환(가공)하는 역할을 합니다.
 */

import { formatDate } from './utils';

/**
 * 페이지네이션 정보를 담는 클래스
 */
export class Pagination {
  static fromApi(apiData) {
    if (!apiData) {
      return { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 };
    }
    return {
      currentPage: apiData.currentPage || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.pageSize || 10,
      totalCount: apiData.totalCount || 0
    };
  }
}

/**
 * 개별 게시글 데이터를 담는 클래스
 */
export class Board {
  /**
   * 백엔드 API 응답 객체를 프론트엔드 표준 Board 객체로 변환합니다.
   * @param {object} apiData - 백엔드로부터 받은 순수 데이터
   * @returns {object} 가공된 Board 객체
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Board.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.boardId,
      title: apiData.title || '',
      content: apiData.content || '',
      author: apiData.userNm || '알수없음', // writerName 대신 userNm 사용
      regId: apiData.regId, // regId 추가
      fileId: apiData.fileId,
      fileList: apiData.fileList || [],
      createdAt: apiData.regDtm || '',
      updatedAt: apiData.updDtm || '',
      permissions: apiData.permissions || { permissions: [] }
    };
  }

  /**
   * Board 객체를 DataTable의 행(row) 데이터 형식으로 변환합니다.
   * @param {object} board - fromApi를 통해 생성된 Board 객체
   * @param {number} rowNumber - 테이블에 표시될 행 번호
   * @returns {object} DataTable에 바로 사용할 수 있는 행 객체
   */
  static toTableRow(board, rowNumber) {
    return {
      id: board.id,
      rowNumber,
      title: board.title,
      author: board.author,
      createdAt: formatDate(board.createdAt),
      originalItem: board // 스타일링, 버튼 클릭 등에서 원본 데이터에 접근하기 위해 포함
    };
  }
}

/**
 * 게시글 목록 API의 전체 응답을 담는 클래스
 */
export class BoardList {
  static fromApi(apiData) {
    if (!apiData || !apiData.list || !apiData.pagination) {
      return { list: [], pagination: Pagination.fromApi(null) };
    }

    const list = apiData.list.map((item) => Board.fromApi(item));
    const pagination = Pagination.fromApi(apiData.pagination);

    return { list, pagination };
  }
}
