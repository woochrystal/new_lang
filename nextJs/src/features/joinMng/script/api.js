/**
 * @fileoverview JoinMng API 서비스
 * @description 가입신청 조회, 승인, 반려, 삭제 API
 */

import { apiClient, defaultErrorHandler } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const ENDPOINT = '/api/v1/join';

const logger = LoggerFactory.getLogger('JoinMngAPI');

export const api = {
  /**
   * 가입신청 목록 조회
   * GET /api/v1/join
   */
  async getList(params = {}) {
    const { data } = await apiClient.get(ENDPOINT, {
      params,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 가입신청 상세 조회
   * GET /api/v1/join/{id}
   */
  async get(id) {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 가입신청 승인
   * POST /api/v1/join/{id}/approve
   * @returns {Promise<boolean>} 승인 성공 여부
   */
  async approve(id) {
    const { data } = await apiClient.post(`${ENDPOINT}/${id}/approve`, null, {
      _onSuccess: () => ({ success: true }),
      _onError: (error) => {
        return { success: false, error };
      }
    });
    return data;
  },

  /**
   * 가입신청 반려
   * POST /api/v1/join/{id}/deny
   * @returns {Promise<boolean>} 반려 성공 여부
   */
  async reject(id) {
    const { data } = await apiClient.post(`${ENDPOINT}/${id}/deny`, null, {
      _onSuccess: () => ({ success: true }),
      _onError: (error) => {
        return { success: false, error };
      }
    });
    return data;
  },

  /**
   * 가입신청 삭제
   * DELETE /api/v1/join/{id}
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(id) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${id}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`[api.delete] 가입신청(ID: ${id}) 삭제 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return !error;
  }
};
