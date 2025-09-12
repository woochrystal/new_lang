/**
 * @fileoverview API 클라이언트
 * @description Axios 기반 API 클라이언트
 *
 * 사용법:
 * import { apiClient } from '@/shared/api/client'
 * const posts = await apiClient.get('/posts')
 * const post = await apiClient.post('/post', data)
 */

import axios from 'axios';

import { useAuthStore } from '../auth';
import { API_CONFIG } from '../config/api';
import { CONTENT_TYPES, ERROR_CODES, STATUS_ERROR_MAP, ERROR_MESSAGES, HTTP_STATUS } from '../constants/http';
import { LoggerFactory } from '../lib/logger';
import { redirectToLogin } from '../lib/routing';

// 로거 인스턴스 생성
const logger = LoggerFactory.getLogger('ApiClient');

/**
 * 사용자 대상 오류 메시지 생성
 * @param {Error} error - 오류 객체
 * @returns {Object} 표준화된 오류 객체
 */
const createReadableError = (error) => {
  let errorCode = ERROR_CODES.UNKNOWN_ERROR;
  let message = ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];

  // 네트워크 오류 처리
  if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
    errorCode = ERROR_CODES.NETWORK_ERROR;
    message = ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
  }
  // 타임아웃 오류 처리
  else if (error.code === 'ECONNABORTED') {
    errorCode = ERROR_CODES.TIMEOUT_ERROR;
    message = ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR];
  }
  // HTTP 상태 코드별 처리
  else if (error.response?.status) {
    const { status } = error.response;
    errorCode = STATUS_ERROR_MAP[status] || ERROR_CODES.UNKNOWN_ERROR;
    message = ERROR_MESSAGES[errorCode];

    // 서버에서 제공하는 메시지가 있으면 사용
    const { data } = error.response;
    if (data?.message) {
      const { message: serverMessage } = data;
      message = serverMessage;
    }
  }

  // 표준화된 오류 객체 생성
  const userError = new Error(message);
  userError.code = errorCode;
  userError.status = error.response?.status;
  userError.originalError = error;
  userError.isUserFriendly = true;

  return userError;
};

/**
 * API 클라이언트
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON
  }
});

/**
 * Request Interceptor
 * JWT 토큰 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    // 토큰 첨부
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 토큰 갱신 및 에러 처리
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 Unauthorized, 공개 API가 아니고, 재시도하지 않은 경우
    const originalRequest = error.config;

    // 401 Unauthorized이고 재시도하지 않은 경우
    // skipAuthRefresh 플래그가 true이면 재시도 로직을 건너뜁니다.
    if (
      !originalRequest.skipAuthRefresh &&
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const authStore = useAuthStore.getState();
      const { refreshToken } = authStore;

      // 리프레시 토큰이 있고 유효한 경우
      if (refreshToken && authStore.isRefreshTokenValid()) {
        try {
          // 토큰 갱신 중 상태 설정은 통합 auth 모듈에서 처리

          // 토큰 갱신 API 호출 (authApi 사용)
          const { authApi } = await import('@/shared/auth/authApi');
          const refreshResponse = { data: await authApi.refresh(refreshToken) };

          const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn } = refreshResponse.data;

          // 새 토큰 저장 (expiresIn 정보 포함)
          if (newRefreshToken) {
            // 리프레시 토큰도 새로 받은 경우 (전체 갱신)
            authStore.setTokens(
              newAccessToken,
              newRefreshToken,
              expiresIn,
              refreshResponse.data.refreshExpiresIn || 7 * 24 * 60 * 60 // 기본 7일
            );
          } else {
            // 액세스 토큰만 갱신된 경우
            authStore.setAccessToken(newAccessToken, expiresIn);
          }

          // 원래 요청에 새 토큰 첨부하여 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          logger.warn('토큰 갱신 실패: {}', refreshError);

          // 리프레시 실패 시 모든 토큰 정리
          authStore.clearTokens();

          // 로그인 페이지로 리다이렉트 (브라우저 환경에서만)
          redirectToLogin();

          // 토큰 갱신 실패도 사용자 대상 메시지로 변환
          return Promise.reject(createReadableError(refreshError));
        }
      } else {
        // 리프레시 토큰이 없거나 만료된 경우
        authStore.clearTokens();

        redirectToLogin();
      }
    }

    // 모든 오류를 사용자 대상 메시지로 변환
    const readableError = createReadableError(error);
    logger.error('API 요청 실패: {} (코드: {})', readableError.message, readableError.code);

    return Promise.reject(readableError);
  }
);
export default apiClient;
