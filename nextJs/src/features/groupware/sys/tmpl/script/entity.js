/**
 * @fileoverview Tmpl 관련 Entity 클래스
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

import { formatDate } from './utils';

/**
 * 템플릿 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Tmpl {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @returns {Object} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Tmpl.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.tmplId,
      code: apiData.tmplCd || '',
      title: apiData.tmplTtl || '',
      content: apiData.tmplCtt || '',
      useYn: apiData.useYn || 'Y',
      authorId: apiData.regId,
      authorName: apiData.regUsrName || '',
      createdAt: apiData.regDtm || '',
      updaterId: apiData.updId,
      updaterName: apiData.updUsrName || '',
      updatedAt: apiData.updDtm || ''
    };
  }

  /**
   * 템플릿 목록을 변환
   * @param {Array} apiList - 백엔드 API 응답 목록
   * @returns {Array} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Tmpl.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Tmpl.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {Object} tmpl - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(tmpl, rowNumber) {
    return {
      id: tmpl.id,
      rowNumber,
      code: tmpl.code,
      title: tmpl.title,
      useYn: tmpl.useYn === 'Y' ? '사용' : '미사용',
      authorName: tmpl.authorName,
      createdAt: formatDate(tmpl.createdAt),
      updatedAt: formatDate(tmpl.updatedAt),
      originalItem: tmpl
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
   * @returns {Object} 변환된 페이지네이션 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Pagination.fromApi: apiData가 필요합니다.');
    }

    // totalPages 계산 (백엔드가 제공하지 않는 경우 대비)
    const totalPages =
      apiData.totalPages || (apiData.totalCount && apiData.size ? Math.ceil(apiData.totalCount / apiData.size) : 1);

    return {
      currentPage: apiData.page || 1,
      totalPages,
      pageSize: apiData.size || 10,
      totalCount: apiData.totalCount || 0
    };
  }
}

/**
 * 템플릿 목록 Entity 클래스
 * API 응답을 템플릿 목록 모델로 변환
 */
export class TmplList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {Object} apiData - 백엔드 API 응답 데이터
   * @param {Array} apiData.list - 템플릿 목록
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalCount - 전체 템플릿 수
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @returns {Object} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      return {
        list: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
          totalCount: 0
        }
      };
    }

    // 페이지네이션 정보가 있는 경우 { list: [], page, size, totalCount, totalPages }
    if (apiData.list && Array.isArray(apiData.list)) {
      return {
        list: Tmpl.fromApiList(apiData.list),
        pagination: Pagination.fromApi(apiData)
      };
    }

    // 배열로만 온 경우 (레거시 대응)
    if (Array.isArray(apiData)) {
      return {
        list: Tmpl.fromApiList(apiData),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
          totalCount: apiData.length
        }
      };
    }

    // 예상치 못한 형태의 응답
    throw new Error(
      `TmplList.fromApi: 예상치 못한 API 응답 구조입니다. ` +
        `배열 또는 { list: [], page, size, totalCount, totalPages } 형태여야 합니다.`
    );
  }
}
