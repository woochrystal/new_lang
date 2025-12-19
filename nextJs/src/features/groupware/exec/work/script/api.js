/**
 * @fileoverview 프로젝트현황 API 서비스
 * @description 프로젝트현황 조회 API 호출
 *
 * 데이터와 콜백을 하나의 객체로 통합
 * _onSuccess: 필수 (데이터 변환)
 * _onError: 선택 (에러 처리)
 */

import { apiClient } from '@/shared/api/client';

import { WORK_CONSTANTS } from './constants';

/**
 * API 베이스 엔드포인트
 * @type {string}
 */
const ENDPOINT = '/api/v1/exec/work';

/**
 * 프로젝트현황 API 서비스
 * 백엔드 API: /api/v1/exec/work
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 프로젝트현황 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/exec/work/list
   * @param {Object} [params={}] - 조회 파라미터
   * @param {number} [params.page=1] - 페이지 번호
   * @param {number} [params.size=10] - 페이지 크기
   * @param {string} [params.empNm] - 직원명 (관리자용)
   * @param {string} [params.startDate] - 시작일 (YYYY-MM-DD)
   * @param {string} [params.endDate] - 종료일 (YYYY-MM-DD)
   * @param {string} [params.searchType] - 검색 타입 (prjNm/prjClient/status/empNm)
   * @param {string} [params.searchKeyword] - 검색 키워드
   * @param {string} [params.prjSt] - 프로젝트 상태
   * @returns {Promise<Object|null>} 프로젝트현황 목록 데이터 (실패 시 null)
   */
  async getList(params = {}) {
    const queryParams = {
      page: params.page || 1,
      size: params.size || WORK_CONSTANTS.DEFAULT_PAGE_SIZE
    };

    // Date range filters
    if (params.startDate) {
      queryParams.startDate = params.startDate;
    }
    if (params.endDate) {
      queryParams.endDate = params.endDate;
    }

    // Search filters
    if (params.searchKeyword) {
      queryParams.searchKeyword = params.searchKeyword;
    }
    if (params.searchType) {
      queryParams.searchType = params.searchType;
    }

    // Status filter
    if (params.prjSt) {
      queryParams.prjSt = params.prjSt;
    }

    // Employee name filter (convert empNm to mbrNm for backend)
    if (params.empNm) {
      queryParams.mbrNm = params.empNm;
    }

    const { data } = await apiClient.get(`${ENDPOINT}/list`, {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 내 프로젝트 목록을 조회합니다. (페이징 지원)
   * GET /api/v1/exec/work/my
   * @param {Object} [params={}] - 조회 파라미터
   * @param {number} [params.page=1] - 페이지 번호
   * @param {number} [params.size=10] - 페이지 크기
   * @returns {Promise<Object|null>} 내 프로젝트 목록 (실패 시 null)
   */
  async getMyList(params = {}) {
    const queryParams = {
      page: params.page || 1,
      size: params.size || WORK_CONSTANTS.DEFAULT_PAGE_SIZE
    };

    const { data } = await apiClient.get(`${ENDPOINT}/my`, {
      params: queryParams,
      _onSuccess: (response) => {
        // 백엔드가 배열로 반환하면 객체로 감싸기 (useApi 호환)
        if (Array.isArray(response.data)) {
          return {
            list: response.data,
            page: queryParams.page,
            size: queryParams.size,
            totalCount: response.data.length,
            totalPages: Math.ceil(response.data.length / queryParams.size)
          };
        }
        return response.data;
      }
    });
    return data;
  }
};
