/**
 * @fileoverview Tmpl API 서비스
 * @description 템플릿 관리 CRUD API 호출
 */

import { apiClient } from '@/shared/api/client';

const ENDPOINT = '/api/v1/sys/tmpl';

/**
 * Tmpl API 서비스
 * 백엔드 API: /api/v1/sys/tmpl
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 템플릿을 생성합니다.
   * POST /api/v1/sys/tmpl
   * @param {Object} tmplData - 템플릿 데이터
   * @param {string} tmplData.title - 템플릿 제목
   * @param {string} tmplData.content - 템플릿 내용 (HTML)
   * @param {string} tmplData.remark - 비고
   * @returns {Promise<boolean>} 생성 성공 여부
   * @description 템플릿 코드(tmplCd)는 백엔드에서 자동 생성되므로 전송하지 않음
   */
  async create(tmplData) {
    const { error } = await apiClient.post(
      ENDPOINT,
      {
        tmplTtl: tmplData.title,
        tmplCtt: tmplData.content,
        useYn: tmplData.useYn || 'Y'
      },
      {
        _onSuccess: () => true
      }
    );

    return !error;
  },

  /**
   * 특정 템플릿의 상세 정보를 조회합니다.
   * GET /api/v1/sys/tmpl/{tmplId}
   * @param {number} tmplId - 조회할 템플릿 ID
   * @returns {Promise<Object|null>} 템플릿 상세 데이터 (실패 시 null)
   */
  async get(tmplId) {
    const { data } = await apiClient.get(`${ENDPOINT}/${tmplId}`, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 템플릿을 수정합니다.
   * PUT /api/v1/sys/tmpl/{tmplId}
   * @param {number} tmplId - 수정할 템플릿 ID
   * @param {Object} tmplData - 수정할 데이터
   * @param {string} tmplData.code - 템플릿 코드 (백엔드 생성값, 변경 불가)
   * @param {string} tmplData.title - 템플릿 제목
   * @param {string} tmplData.content - 템플릿 내용 (HTML)
   * @param {string} tmplData.remark - 비고
   * @returns {Promise<boolean>} 수정 성공 여부
   * @description 템플릿 코드(tmplCd)는 기존 값을 그대로 전송하여 불변성 보장
   */
  async update(tmplId, tmplData) {
    const { error } = await apiClient.put(
      `${ENDPOINT}/${tmplId}`,
      {
        tmplCd: tmplData.code,
        tmplTtl: tmplData.title,
        tmplCtt: tmplData.content,
        useYn: tmplData.useYn || 'Y'
      },
      {
        _onSuccess: () => true
      }
    );
    return !error;
  },

  /**
   * 특정 템플릿을 삭제합니다.
   * DELETE /api/v1/sys/tmpl/{tmplId}
   * @param {number} tmplId - 삭제할 템플릿 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(tmplId) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${tmplId}`, {
      _onSuccess: () => true
    });
    return !error;
  },

  /**
   * 템플릿 목록을 조회합니다. (페이징, 검색, 필터 지원)
   * GET /api/v1/sys/tmpl/list
   * @param {Object} params - 조회 파라미터
   * @param {string} params.searchType - 검색 타입 (title, author)
   * @param {string} params.searchKeyword - 검색 키워드
   * @param {string} params.startDate - 조회 시작일
   * @param {string} params.endDate - 조회 종료일
   * @param {number} params.page - 페이지 번호
   * @param {number} params.pageSize - 페이지 크기
   * @returns {Promise<Array|null>} 템플릿 목록 데이터 (실패 시 null)
   */
  async getList(params = {}) {
    // 기본 파라미터 (항상 포함)
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 10
    };

    // 값이 있는 경우에만 추가 (빈 문자열 제외)
    if (params.searchType) {
      queryParams.searchType = params.searchType;
    }
    if (params.searchKeyword) {
      queryParams.searchKeyword = params.searchKeyword;
    }
    if (params.useYn) {
      queryParams.useYn = params.useYn;
    }

    const { data } = await apiClient.get(`${ENDPOINT}/list`, {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  }
};
