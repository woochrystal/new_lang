/**
 * @fileoverview position API 서비스 (실제 백엔드 매칭)
 * @description position CRUD API 호출 (Pentaware SaaS 백엔드 연동)
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
const ENDPOINT = '/api/v1/positions';

const logger = LoggerFactory.getLogger('positionAPI');

/**
 * position API 서비스
 * 백엔드 API: http://localhost:8080/api/v1/positions
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 직급 목록을 조회합니다. (검색 지원)
   * GET /api/v1/positions
   * @param {import('./schema').positionListQuery} [params={}] - 조회 파라미터
   * @returns {Promise<import('./entity').ApipositionList|null>} 직급 목록 데이터 (실패 시 null)
   */
  async getList(params = {}) {
    const { data } = await apiClient.get(ENDPOINT, {
      params,
      _onSuccess: (response) => {
        // 응답 데이터가 비어있을 경우(204 No Content 등)를 대비하여
        // 기본값으로 빈 배열을 반환합니다.
        return response.data || [];
      }
    });
    return data;
  },

  /**
   * 직급을 생성합니다.
   * POST /api/v1/positions
   * @param {import('./schema').positionInput} positionData - 직급 데이터
   * @returns {Promise<number|null>} 생성된 직급의 ID (실패 시 null)
   */
  async create(positionData) {
    const body = {
      posNm: positionData.posNm,
      posOrd: parseInt(positionData.posOrd, 10)
    };

    const { data } = await apiClient.post(ENDPOINT, {
      ...body,
      _onSuccess: (response) => {
        return response.status === 201 ? true : response.data;
      }
    });
    return data;
  },

  /**
   * 특정 직급의 상세 정보를 조회합니다.
   * GET /api/v1/positions/{id}
   * @param {number} id - 조회할 직급의 ID
   * @returns {Promise<import('./entity').Apiposition|null>} 직급 상세 데이터 (실패 시 null)
   */
  async get(id) {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`, { _onSuccess: (response) => response.data });
    return data;
  },

  /**
   * 특정 직급을 수정합니다.
   * PUT /api/v1/positions/{id}
   * @param {number} id - 수정할 직급의 ID
   * @param {import('./schema').positionInput} positionData - 수정할 데이터
   * @returns {Promise<import('./entity').Apiposition|null>} 수정된 직급 데이터 (실패 시 null)
   */
  async update(id, positionData) {
    if (!positionData) {
      logger.error(`[api.update] 직급(ID: ${id}) 수정 실패: positionData가 null입니다.`);
      return null;
    }

    const body = {
      posNm: positionData.posNm,
      posOrd: parseInt(positionData.posOrd, 10)
    };
    try {
      const { data } = await apiClient.put(`${ENDPOINT}/${id}`, {
        ...body,
        _onSuccess: (response) => response.data
      });
      return data;
    } catch (error) {
      logger.error(`[api.update] 직급(ID: ${id}) 수정 실패:`, error);
      return null;
    }
  },

  /**
   * 직급을 삭제합니다.
   * (백엔드에서 에러메시지 전송)
   * DELETE /api/v1/positions/{id}
   * @param {number} id - 삭제할 직급의 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(id) {
    const { data } = await apiClient.delete(`${ENDPOINT}/${id}`, {
      _onSuccess: () => ({ success: true }),
      _onError: (error) => {
        return { success: false, error };
      }
    });
    return data;
  }
};
