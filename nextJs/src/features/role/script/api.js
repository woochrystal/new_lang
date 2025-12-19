/**
 * @fileoverview role API 서비스
 * @description role CRUD API 호출
 */

import { apiClient } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const ENDPOINT = '/api/v1/roles';
const MENU_ENDPOINT = '/api/menus';
const logger = LoggerFactory.getLogger('roleAPI');

export const api = {
  /**
   * 권한(역할) 목록을 조회합니다.
   * GET /api/v1/roles
   */
  async getList() {
    const { data } = await apiClient.get(ENDPOINT, {
      _onSuccess: (response) => response.data || []
    });
    return data;
  },

  /**
   * ADM이 접근 가능한 메뉴 목록을 조회합니다.
   * GET /api/v1/menus/adm
   */
  async getAllMenusForAdm() {
    const { data } = await apiClient.get(`${MENU_ENDPOINT}/adm`, {
      _onSuccess: (response) => response.data || []
    });
    return data;
  },

  /**
   * 특정 권한의 메뉴 목록을 조회합니다.
   * GET /api/v1/roles/{authId}/menus
   */
  async getMenus(authId) {
    const { data } = await apiClient.get(`${ENDPOINT}/${authId}/menus`, {
      _onSuccess: (response) => response.data || []
    });
    return data;
  },

  /**
   * 대시보드의 메뉴 ID를 조회합니다.
   * GET /api/v1/dashboardId
   */
  async getDashboardId() {
    const { data } = await apiClient.get(`${MENU_ENDPOINT}/dashboardId`, {
      _onSuccess: (response) => response.data || null
    });
    return data;
  },

  /**
   * 권한을 생성합니다.
   * POST /api/v1/roles
   */
  async create(roleData) {
    const { data } = await apiClient.post(ENDPOINT, roleData, {
      _onSuccess: (response) => {
        return response.data;
      }
    });
    return data;
  },

  /**
   * 권한을 수정합니다.
   * PUT /api/v1/roles/{authId}
   */
  async update(authId, roleData) {
    if (!roleData) {
      logger.error(`[api.update] 권한(ID: ${authId}) 수정 실패: roleData가 null입니다.`);
      return null;
    }

    try {
      const { data } = await apiClient.put(`${ENDPOINT}/${authId}`, {
        ...roleData,
        _onSuccess: () => true
      });
      return data;
    } catch (error) {
      logger.error(`[api.update] 권한(ID: ${authId}) 수정 실패:`, error);
      return null;
    }
  },

  /**
   * 권한을 삭제합니다.
   * (백엔드에서 에러메시지 전송)
   * DELETE /api/v1/roles/{authId}
   */
  async delete(authId) {
    const { data } = await apiClient.delete(`${ENDPOINT}/${authId}`, {
      _onSuccess: () => ({ success: true }),
      _onError: (error) => {
        return { success: false, error };
      }
    });
    return data;
  },

  /**
   * 권한에 메뉴를 매핑합니다.
   * PUT /api/v1/roles/{authId}/menus
   */
  async updateMenus(authId, menuIds) {
    try {
      const payload = {
        authId,
        menuIds
      };

      const { data } = await apiClient.put(`${ENDPOINT}/${authId}/menus`, payload, { _onSuccess: () => true });
      return data;
    } catch (error) {
      logger.error(`[api.updateMenus] 권한(ID: ${authId}) 메뉴 매핑 실패:`, error);
      return null;
    }
  }
};
