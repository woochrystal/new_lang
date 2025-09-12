/**
 * @fileoverview 인증 관련 API 서비스
 * @description 로그인, 로그아웃, 토큰 갱신, 프로필 관리 등 인증 API 호출
 */

import { apiClient } from '@/shared/api/client';

/**
 * 인증 관련 API 서비스
 */
export const authApi = {
  /**
   * 로그인
   * @param {Object} credentials - 로그인 자격증명
   * @param {string} credentials.userId - 사용자 ID
   * @param {string} credentials.userPw - 비밀번호
   * @returns {Promise<Object>} 로그인 응답
   */
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * 로그아웃
   * @returns {Promise<void>}
   */
  logout: async () => {
    await apiClient.post('/api/auth/logout');
  },

  /**
   * 토큰 갱신
   * @param {string} refreshToken - 리프레시 토큰
   * @returns {Promise<Object>} 새로운 토큰
   */
  refresh: async (refreshToken) => {
    const response = await apiClient.post(
      '/api/auth/refresh',
      { refreshToken },
      {
        skipAuthRefresh: true // 무한 루프 방지
      }
    );
    return response.data;
  },

  /**
   * 현재 사용자 정보 및 권한 조회
   * // 백엔드 미구현
   *
   * @returns {Promise<Object>} 사용자 정보 + 권한 정보
   * @example
   * {
   *   id: "user123",
   *   name: "홍길동",
   *   email: "user@example.com",
   *   tenantId: "company1",
   *   permissions: [
   *     "vacation.read", "vacation.write",
   *     "expense.read", "member.write",
   *     "admin.*", "*.read"
   *   ],
   *   features: ["reports", "analytics"]
   * }
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};
