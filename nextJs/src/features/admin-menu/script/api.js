/**
 * @fileoverview Admin Menu API 서비스
 * @description 시스템 어드민 메뉴 관리 API 호출
 */

import { apiClient } from '@/shared/api/client';

const ENDPOINT = '/api/admin/menu';

export const api = {
  /**
   * 전체 메뉴 트리 조회 (Full Tree)
   * GET /api/admin/menu
   */
  async getFullTree() {
    const { data } = await apiClient.get(`${ENDPOINT}`, {
      _onSuccess: (response) => {
        const resData = response.data;
        if (Array.isArray(resData)) {
          return resData;
        }
        return resData ? [resData] : [];
      }
    });
    return data;
  },

  /**
   * 메뉴 생성
   * POST /api/admin/menu/create
   */
  async create(menuData, _onSuccess, _onError, _finally) {
    // Backend expects 'sortOrder' instead of 'order'
    // Backend expects 'visible' (boolean) or 'useYn' (String)
    const payload = {
      ...menuData,
      sortOrder: menuData.order,
      visible: menuData.useYn === 'Y'
    };

    const { data } = await apiClient.post(`${ENDPOINT}/create`, payload, {
      _onSuccess,
      _onError,
      _finally
    });
    return data;
  },

  /**
   * 메뉴 수정
   * POST /api/admin/menu/update
   */
  async update(menuData, _onSuccess, _onError) {
    const payload = {
      ...menuData,
      sortOrder: menuData.order,
      visible: menuData.useYn === 'Y' // useYn 'Y'/'N'을 visible true/false로 매핑
    };
    // Backend uses POST for update now
    const { data } = await apiClient.post(`${ENDPOINT}/update`, payload, {
      _onSuccess,
      _onError
    });
    return data;
  },

  /**
   * 메뉴 완전 삭제 (DB 삭제)
   * DELETE /api/admin/menu/{menuId}
   */
  async delete(menuId, _onSuccess, _onError) {
    const { data } = await apiClient.delete(`${ENDPOINT}/${menuId}`, {
      _onSuccess,
      _onError
    });
    return data;
  },

  /**
   * 메뉴 비활성화 (Soft Delete)
   * PUT /api/admin/menu/{menuId}/deactivate
   */
  async deactivate(menuId) {
    const { data } = await apiClient.put(
      `${ENDPOINT}/${menuId}/deactivate`,
      {},
      {
        _onSuccess: () => true
      }
    );
    return data;
  },

  /**
   * 메뉴 활성화
   * PUT /api/admin/menu/{menuId}/activate
   */
  async activate(menuId) {
    const { data } = await apiClient.put(
      `${ENDPOINT}/${menuId}/activate`,
      {},
      {
        _onSuccess: () => true
      }
    );
    return data;
  },

  /**
   * 메뉴 이동 (Tree)
   * POST /api/admin/menu/tree/move
   */
  async move(moveData) {
    // moveData definition in backend (MenuReqIDT):
    // menuId, moveTarget (INTO/BEFORE/AFTER), referenceId
    const { data } = await apiClient.post(`${ENDPOINT}/tree/move`, moveData, {
      _onSuccess: () => true
    });
    return data;
  }
};
