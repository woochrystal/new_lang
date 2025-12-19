/**
 * @fileoverview join API 서비스
 * @description 기업 회원가입 API 호출
 */

import { apiClient } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const ENDPOINT = '/api/v1/join';
const logger = LoggerFactory.getLogger('joinAPI');

export const api = {
  /**
   * 도메인 경로 중복 확인
   * GET /api/v1/join/check-domain/{domainPath}
   */
  async checkDomainPathDuplication(domainPath) {
    try {
      const { data } = await apiClient.get(`${ENDPOINT}/check-domain/${domainPath}`, {
        _onSuccess: (response) => response.data
      });

      if (typeof data !== 'object' || data === null || typeof data.isDuplicated !== 'boolean') {
        throw new Error('서버 응답 형식이 올바르지 않습니다.');
      }

      return data;
    } catch (error) {
      logger.error(`[api.checkDomainPathDuplication] 도메인 중복 확인 실패:`, error);
      throw error;
    }
  },

  /**
   * 기업 회원 등록 (가입 신청)
   * POST /api/v1/join
   */
  async create(joinData) {
    try {
      const config = {
        _onSuccess: (response) => {
          return response.data;
        }
      };

      if (typeof FormData !== 'undefined' && joinData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }

      const { data } = await apiClient.post(ENDPOINT, joinData, config);
      return data;
    } catch (error) {
      logger.error(`[api.registerTenant] 기업 회원 등록 실패:`, error);
      throw error;
    }
  }
};
