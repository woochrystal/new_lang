/**
 * @fileoverview Notice 관련 Entity 클래스 및 API 타입 정의
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
 * 개별 공지사항 데이터를 담는 클래스
 */
export class Notice {
  /**
   * 백엔드 API 응답 객체를 프론트엔드 표준 Notice 객체로 변환합니다.
   * @param {object} apiData - 백엔드로부터 받은 순수 데이터
   * @returns {object} 가공된 Notice 객체
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Notice.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.boardId,
      title: apiData.title || '',
      content: apiData.content || '',
      author: apiData.writerName || '알수없음',
      /* 첨부파일 추가 */
      fileId: apiData.fileId,
      fileList: apiData.fileList || [],
      /* 첨부파일 추가 */
      createdAt: apiData.regDtm || '',
      updatedAt: apiData.updDtm || '',
      isPriority: apiData.priority === 'Y', // 원래의 올바른 로직으로 복원
      type: apiData.boardTy || 'NOTICE',
      permissions: apiData.permissions || { permissions: [] }
    };
  }

  /**
   * Notice 객체를 DataTable의 행(row) 데이터 형식으로 변환합니다.
   * @param {object} notice - fromApi를 통해 생성된 Notice 객체
   * @param {number} rowNumber - 테이블에 표시될 행 번호
   * @returns {object} DataTable에 바로 사용할 수 있는 행 객체
   */
  static toTableRow(notice, rowNumber) {
    return {
      id: notice.id,
      rowNumber,
      title: notice.title,
      author: notice.author,
      createdAt: formatDate(notice.createdAt),
      originalItem: notice // 스타일링, 버튼 클릭 등에서 원본 데이터에 접근하기 위해 포함
    };
  }
}

/**
 * 공지사항 목록 API의 전체 응답을 담는 클래스
 */
export class NoticeList {
  static fromApi(apiData) {
    if (!apiData || !apiData.list || !apiData.pagination) {
      return { list: [], pagination: Pagination.fromApi(null) };
    }

    const list = apiData.list.map((item) => Notice.fromApi(item));
    const pagination = Pagination.fromApi(apiData.pagination);

    return { list, pagination };
  }
}
