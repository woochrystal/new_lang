/*
 * path           : features/groupware/sys/info/script
 * fileName       : api.js
 * author         : Park ChangHyeon
 * date           : 25.12.16
 * description    : 회사 정보 API
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.16        Park ChangHyeon       최초 생성
 */
import { apiClient } from '@/shared/api';

/**
 * 회사 정보 API
 */
export const api = {
  /**
   * 회사 정보 조회
   * @returns {Promise<Object|null>} 회사 정보 또는 null
   */
  get: async () => {
    const { data, error } = await apiClient.get('/api/v1/company/info', {
      _onSuccess: (response) => response.data
    });

    if (error) {
      return null;
    }
    return data;
  },

  /**
   * 회사 정보 수정
   * @param {FormData} formData - 회사 정보 FormData 멀티파트
   * @returns {Promise<{data: Object|null, error: Object|null}>}
   */
  update: async (formData) => {
    const { data: responseData, error } = await apiClient.put('/api/v1/company/info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (err) => {
        return err;
      }
    });

    if (error) {
      return { data: null, error };
    }
    return { data: responseData, error: null };
  }
};

export default api;
