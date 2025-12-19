/**
 * @fileoverview 업무현황 - 휴가/비용/일반 현황 API
 * @description 임원급 휴가/비용/일반 결재 현황 조회 API
 */

import { apiClient } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const logger = LoggerFactory.getLogger('execVacExpenseApi');

/**
 * 업무현황 - 휴가/비용/일반 현황 API 서비스
 */
export const execVacExpenseApi = {
  /**
   * 휴가 현황 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/exec/vac/getList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<ExecAprvListODT|null>} 휴가 현황 목록 데이터 (실패 시 null)
   */
  async getVacList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/exec/vac/getList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 비용 현황 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/exec/expense/getList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<ExecAprvListODT|null>} 비용 현황 목록 데이터 (실패 시 null)
   */
  async getExpenseList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/exec/expense/getList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 일반 현황 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/exec/general/getList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<ExecAprvListODT|null>} 일반 현황 목록 데이터 (실패 시 null)
   */
  async getGeneralList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/exec/general/getList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  }
};
