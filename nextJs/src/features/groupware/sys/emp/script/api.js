/**
 * @fileoverview Emp API 서비스
 * @description 직원 관리 CRUD API 호출
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
const ENDPOINT = '/api/v1/sys/employees';

const logger = LoggerFactory.getLogger('EmpAPI');

/**
 * Emp API 서비스
 * 백엔드 API: /api/v1/sys/employees
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 직원을 생성합니다.
   * POST /api/v1/sys/employees
   * @param {FormData} formData - 직원 데이터 (multipart/form-data)
   * @returns {Promise<number|null>} 생성된 직원의 ID (실패 시 null)
   */
  async create(formData) {
    const { data } = await apiClient.post(ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 직원의 상세 정보를 조회합니다.
   * GET /api/v1/sys/employees/{empNo}
   * @param {string} empNo - 조회할 직원의 사번
   * @returns {Promise<import('./entity').ApiEmp|null>} 직원 상세 데이터 (실패 시 null)
   */
  async get(empNo) {
    const { data } = await apiClient.get(`${ENDPOINT}/${empNo}`, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 직원을 수정합니다.
   * PUT /api/v1/sys/employees/{empNo}
   * @param {string} empNo - 수정할 직원의 사번
   * @param {FormData} formData - 수정할 데이터 (multipart/form-data)
   * @returns {Promise<import('./entity').ApiEmp|null>} 수정된 직원 데이터 (실패 시 null)
   */
  async update(empNo, formData) {
    const { data } = await apiClient.put(`${ENDPOINT}/${empNo}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 직원을 삭제합니다.
   * DELETE /api/v1/sys/employees/{empNo}
   * @param {string} empNo - 삭제할 직원의 사번
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(empNo) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${empNo}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`[api.delete] 직원(사번: ${empNo}) 삭제 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return !error;
  },

  /**
   * 직원 목록을 조회합니다. (페이징, 검색, 필터 지원)
   * GET /api/v1/sys/employees/search
   * @param {import('./schema').EmpListQuery} [queryParams={}] - 조회 파라미터
   * @returns {Promise<import('./entity').ApiEmpList|null>} 직원 목록 데이터 (실패 시 null)
   */
  async getList(queryParams = {}) {
    const { data } = await apiClient.get(`${ENDPOINT}/search`, {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 비밀번호 초기화 (테넌트 INIT_PWD로 자동 초기화)
   * POST /api/v1/sys/employees/{empNo}/reset-password
   * @param {string} empNo - 대상 직원 사번
   * @returns {Promise<boolean>} 성공 여부
   */
  async resetPassword(empNo) {
    const { error } = await apiClient.post(
      `${ENDPOINT}/${empNo}/reset-password`,
      {},
      {
        _onSuccess: () => true,
        _onError: (error) => {
          logger.error(`[api.resetPassword] 비밀번호 초기화 실패 (사번: ${empNo}):`, error);
          return defaultErrorHandler(error);
        }
      }
    );
    return !error;
  },

  /**
   * 테넌트 초기 비밀번호 조회
   * GET /api/v1/sys/employees/init-password
   * @returns {Promise<{hasInitPassword: boolean}>}
   */
  async getTenantInitPassword() {
    const { data, error } = await apiClient.get(`${ENDPOINT}/init-password`, {
      _onSuccess: (response) => response.data
    });
    return { data, error };
  },

  /**
   * 테넌트 초기 비밀번호 설정
   * PUT /api/v1/sys/employees/init-password
   * @param {string} password - 새 초기 비밀번호
   * @returns {Promise<boolean>} 성공 여부
   */
  async setTenantInitPassword(password) {
    const { error } = await apiClient.put(
      `${ENDPOINT}/init-password`,
      { password },
      {
        _onSuccess: () => true,
        _onError: (error) => {
          logger.error('[api.setTenantInitPassword] 초기 비밀번호 설정 실패:', error);
          return defaultErrorHandler(error);
        }
      }
    );
    return !error;
  },

  /**
   * 직원 등록/수정 폼 옵션을 조회합니다 (부서, 직급, 역할 목록)
   * GET /api/v1/sys/employees/form-options
   * @returns {Promise<{departments: Array, positions: Array, roles: Array}|null>} 폼 옵션 데이터 (실패 시 null)
   */
  async getFormOptions() {
    const { data } = await apiClient.get(`${ENDPOINT}/form-options`, {
      _onSuccess: (response) => {
        logger.info('[api.getFormOptions] 폼 옵션 조회 성공:', response.data);
        return response.data;
      },
      _onError: (error) => {
        logger.error('[api.getFormOptions] 폼 옵션 조회 실패:', error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   * 권한(역할) 목록을 조회합니다.
   * GET /api/v1/roles
   * del_yn='N'인 활성 권한만 반환
   * @returns {Promise<Array<{value: string, label: string}>|null>}
   */
  async getRoles() {
    const { data } = await apiClient.get('/api/v1/roles', {
      _onSuccess: (response) => {
        const roles = response.data || [];
        logger.info('[api.getRoles] 권한 목록 조회 완료:', roles.length);
        // del_yn='N'인 활성 권한만 필터링하고 옵션 형식으로 변환
        return roles
          .filter((role) => role.del_yn === 'N')
          .map((role) => ({
            value: String(role.auth_id),
            label: role.auth_nm
          }));
      },
      _onError: (error) => {
        logger.error('[api.getRoles] 권한 목록 조회 실패:', error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  }
};
