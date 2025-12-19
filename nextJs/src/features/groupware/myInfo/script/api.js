/**
 * @fileoverview 내 정보 API 서비스
 */

import { apiClient } from '@/shared/api';
import { LoggerFactory } from '@/shared/lib/logger';

const logger = LoggerFactory.getLogger('MyInfoAPI');

/**
 * 내 정보 API
 */
export const api = {
  /**
   * 내 정보 조회
   * @returns {Promise<Object|null>}
   */
  get: async () => {
    logger.info('내 정보 조회 시작');
    const { data, error } = await apiClient.get('/api/v1/myinfo/profile', {
      _onSuccess: (response) => response.data
    });

    if (error) {
      logger.error('내 정보 조회 실패');
      return null;
    }

    logger.info('내 정보 조회 성공');
    return data;
  },

  /**
   * 내 정보 수정 (FormData 전용)
   * @param {FormData} formData - 수정할 데이터 (multipart/form-data)
   * @returns {Promise<{data: Object|null, error: Object|null}>}
   */
  update: async (formData) => {
    logger.info('내 정보 수정 시작');

    const { data: responseData, error } = await apiClient.put('/api/v1/myinfo/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (err) => {
        // 유효성 검증 에러는 에러 객체 그대로 반환 (필드별 에러 처리용)
        logger.error('내 정보 수정 실패:', err);
        return err;
      }
    });

    if (error) {
      logger.error('내 정보 수정 실패');
      return { data: null, error };
    }

    logger.info('내 정보 수정 성공');
    return { data: responseData, error: null };
  },

  /**
   * 비밀번호 변경
   * @param {Object} passwordData - 비밀번호 변경 데이터
   * @param {string} passwordData.currentPassword - 현재 비밀번호
   * @param {string} passwordData.newPassword - 새 비밀번호
   * @param {string} passwordData.confirmPassword - 새 비밀번호 확인
   * @returns {Promise<boolean>}
   */
  changePassword: async (passwordData) => {
    logger.info('비밀번호 변경 요청 시작');
    const { data, error } = await apiClient.put(
      '/api/v1/myinfo/profile/password/change',
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      },
      {
        _onSuccess: (response) => response.data
      }
    );

    if (error) {
      logger.error('비밀번호 변경 실패');
      return null;
    }

    logger.info('비밀번호 변경 성공');
    return data;
  }
};
