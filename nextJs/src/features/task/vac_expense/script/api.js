/**
 * @fileoverview Approval API 서비스
 * @description 결재 관련 CRUD API 호출
 */

import { apiClient } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const logger = LoggerFactory.getLogger('vacExpenseApi');

/**
 * Approval API 서비스
 */
export const vacExpenseApi = {
  /**
   * 휴가 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/task/vac/getList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<TaskAprvListODT|null>} 결재 현황 목록 데이터 (실패 시 null)
   */
  async getVacList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/task/vac/getList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 비용 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/task/expense/getList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<TaskAprvListODT|null>} 결재 현황 목록 데이터 (실패 시 null)
   */
  async getExpenseList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/task/expense/getList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 전체 휴가일수 및 사용 휴가일수를 조회합니다.
   * GET /api/v1/task/vac/getVacCnt
   * @returns {Promise<TaskVacCntODT|null>} 휴가 일수 데이터 (실패 시 null)
   */
  async getVacCnt() {
    const { data } = await apiClient.get('/api/v1/task/vac/getVacCnt', {
      _onSuccess: (response) => response.data
    });
    return data;
  }
};
