/**
 * @fileoverview Sample API 서비스 (실제 백엔드 매칭)
 * @description Sample CRUD API 호출 (Pentaware SaaS 백엔드 연동)
 *
 * 데이터와 콜백을 하나의 객체로 통합
 * _onSuccess: 필수 (데이터 변환)
 * _onError: 선택 (에러 처리)
 */

import { apiClient, defaultErrorHandler } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

/**
 * API 베이스 엔드포인트
 * @type {string}
 */
const ENDPOINT = '/api/sample/boards';

const logger = LoggerFactory.getLogger('ExampleAPI');

/**
 * Board API 서비스
 * 백엔드 API: http://localhost:8080/api/sample/boards
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 게시글을 생성합니다.
   * POST /api/sample/boards
   * @param {import('./schema').BoardInput} boardData - 게시글 데이터
   * @returns {Promise<number|null>} 생성된 게시글의 ID (실패 시 null)
   */
  async create(boardData) {
    const body = {
      title: boardData.title,
      content: boardData.content
    };
    const { data } = await apiClient.post(ENDPOINT, {
      ...body,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   * GET /api/sample/boards/{id}
   * @param {number} id - 조회할 게시글의 ID
   * @returns {Promise<import('./entity').ApiBoard|null>} 게시글 상세 데이터 (실패 시 null)
   */
  async get(id) {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`, { _onSuccess: (response) => response.data });
    return data;
  },

  /**
   * 특정 게시글을 수정합니다.
   * PUT /api/sample/boards/{id}
   * @param {number} id - 수정할 게시글의 ID
   * @param {import('./schema').BoardInput} boardData - 수정할 데이터
   * @returns {Promise<import('./entity').ApiBoard|null>} 수정된 게시글 데이터 (실패 시 null)
   */
  async update(id, boardData) {
    const body = {
      title: boardData.title,
      content: boardData.content
    };
    const { data } = await apiClient.put(`${ENDPOINT}/${id}`, {
      ...body,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 게시글을 삭제합니다.
   * DELETE /api/sample/boards/{id}
   * @param {number} id - 삭제할 게시글의 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(id) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${id}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`[api.delete] 게시글(ID: ${id}) 삭제 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return !error;
  },

  /**
   * 게시글 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/sample/boards
   * @param {import('./schema').BoardListQuery} [params={}] - 조회 파라미터
   * @returns {Promise<import('./entity').ApiBoardList|null>} 게시글 목록 데이터 (실패 시 null)
   */
  async getList(params = {}) {
    const { data } = await apiClient.get(ENDPOINT, {
      ...params,
      _onSuccess: (response) => response.data
    });
    return data;
  }
};
