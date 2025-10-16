/**
 * @fileoverview Sample API 서비스 (실제 백엔드 매칭)
 * @description Sample CRUD API 호출 (Pentaware SaaS 백엔드 연동)
 */

import { apiClient } from '@/shared/api/client';

/**
 * API 베이스 엔드포인트
 * @type {string}
 */
const BASE_ENDPOINT = '/api/sample/boards';

/**
 * Sample Board API 서비스
 * 백엔드 API: http://localhost:8080/api/sample/boards
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const sampleApi = {
  /**
   * 게시글을 생성합니다.
   * POST /api/sample/boards
   * @param {object} boardData - 게시글 데이터.
   * @param {string} boardData.title - 제목 (필수).
   * @param {string} boardData.content - 내용 (필수).
   * @returns {Promise<number>} 생성된 게시글의 ID.
   */
  create: async (boardData) => {
    const response = await apiClient.post(BASE_ENDPOINT, {
      title: boardData.title,
      content: boardData.content
    });
    return response.data; // Long 타입의 boardId
  },

  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   * GET /api/sample/boards/{id}
   * @param {number} id - 조회할 게시글의 ID.
   * @returns {Promise<object>} 게시글 상세 데이터 (SampleBoardODT).
   */
  get: async (id) => {
    const response = await apiClient.get(`${BASE_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * 특정 게시글을 수정합니다.
   * PUT /api/sample/boards/{id}
   * @param {number} id - 수정할 게시글의 ID.
   * @param {object} boardData - 수정할 데이터.
   * @param {string} boardData.title - 제목.
   * @param {string} boardData.content - 내용.
   * @returns {Promise<object>} 수정된 게시글 데이터 (SampleBoardODT).
   */
  update: async (id, boardData) => {
    const response = await apiClient.put(`${BASE_ENDPOINT}/${id}`, {
      title: boardData.title,
      content: boardData.content
    });
    return response.data; // SampleBoardODT
  },

  /**
   * 특정 게시글을 삭제합니다.
   * DELETE /api/sample/boards/{id}
   * @param {number} id - 삭제할 게시글의 ID.
   * @returns {Promise<void>} 삭제 완료 시 아무것도 반환하지 않습니다.
   */
  delete: async (id) => {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },

  /**
   * 게시글 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/sample/boards
   * @param {object} [params={}] - 조회 파라미터.
   * @param {number} [params.page=1] - 페이지 번호.
   * @param {number} [params.size=10] - 페이지 크기.
   * @param {string} [params.searchKeyword] - 검색 키워드.
   * @returns {Promise<object>} 게시글 목록 데이터 (SampleBoardListODT).
   */
  getList: async (params = {}) => {
    const queryParams = new URLSearchParams();

    // 백엔드 컨트롤러 파라미터에 맞게 설정
    if (params.page) {
      queryParams.append('page', params.page);
    }
    if (params.size) {
      queryParams.append('size', params.size);
    }
    if (params.searchKeyword) {
      queryParams.append('searchKeyword', params.searchKeyword);
    }

    const response = await apiClient.get(`${BASE_ENDPOINT}?${queryParams.toString()}`);
    return response.data; // SampleBoardListODT 구조
  }
};
