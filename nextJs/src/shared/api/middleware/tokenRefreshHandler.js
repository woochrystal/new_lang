/*
 * path           : src/shared/api/middleware/tokenRefreshHandler.js
 * fileName       : tokenRefreshHandler
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : 인증 만료 시 토큰 자동 갱신 및 요청 재시도
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 */

// TokenRefreshQueue는 lazy initialization으로 로드
import { LoggerFactory } from '@/shared/lib';

import { HTTP_STATUS } from '../constants';

const logger = LoggerFactory.getLogger('TokenRefreshHandler');

// 토큰 갱신 큐 (lazy initialization)
let refreshQueue = null;

const getRefreshQueueInstance = () => {
  if (!refreshQueue) {
    const { TokenRefreshQueue } = require('@/shared/auth');
    refreshQueue = new TokenRefreshQueue();
  }
  return refreshQueue;
};

/**
 * 401 에러 시 토큰 갱신 시도
 *
 * @param {import('axios').AxiosError} error - 에러 객체
 * @param {import('axios').AxiosInstance} apiClient - API 클라이언트 인스턴스
 * @param {Function} createReadableError - 사용자 대상 에러 생성 함수
 * @param {Function} defaultErrorHandler - 기본 에러 핸들러
 * @returns {Promise<{data: any, error: Error}> | null} 처리 결과 또는 null (다른 핸들러로 진행)
 *
 * @example
 * const result = await handleTokenRefresh(error, apiClient, createReadableError, defaultErrorHandler);
 * if (result) return result;
 */
// eslint-disable-next-line complexity
export const handleTokenRefresh = async (error, apiClient, createReadableError, defaultErrorHandler) => {
  // 1. 응답이 401이 아니면 처리 안 함
  if (error.response?.status !== HTTP_STATUS.UNAUTHORIZED) {
    return null; // 다른 핸들러로 진행
  }

  // 2. 이미 재시도했거나 갱신을 스킵하는 요청이면 처리 안 함
  const { config: originalRequest } = error;
  if (originalRequest._retry || originalRequest.skipAuthRefresh) {
    return null; // 다른 핸들러로 진행
  }

  // 3. 로그아웃 진행 중이면 처리 안 함
  const { useAuthStore } = await import('@/shared/auth');
  const { isLoggingOut } = useAuthStore.getState();
  if (isLoggingOut) {
    logger.info('[TokenRefreshHandler] 로그아웃 진행 중, 토큰 갱신 건너뜀');
    return Promise.resolve({
      data: null,
      error: { message: 'Logout in progress' }
    });
  }

  // 4. 이미 갱신 중이면 대기열에 추가
  const queue = getRefreshQueueInstance();
  if (queue.isRefreshing()) {
    logger.debug('[TokenRefreshHandler] 토큰 갱신 대기열에 추가 (갱신 중...)');
    try {
      // 로그아웃이 시작되면 대기 중단
      if (useAuthStore.getState().isLoggingOut) {
        throw new Error('Logout in progress during token refresh');
      }
      // 큐에 추가하고, 큐 처리 시 실행된 결과를 반환
      return await queue.add(originalRequest);
    } catch (err) {
      logger.warn('[TokenRefreshHandler] 토큰 갱신 대기 중 에러: {}', err.message);
      const errorHandler = originalRequest?._onError || defaultErrorHandler;
      const transformedData = errorHandler(err);
      return { data: transformedData, error: err };
    }
  }

  // 5. 갱신 시작
  logger.info('[TokenRefreshHandler] 토큰 갱신 시작');
  originalRequest._retry = true;
  queue.setRefreshing(true);

  try {
    // 5-1. tokenStore 로드 및 리프레시 토큰 확인
    const { useTokenStore } = await import('@/shared/auth');
    const tokenStore = useTokenStore.getState();
    const { refreshToken } = tokenStore;

    if (!refreshToken || !tokenStore.isRefreshTokenValid()) {
      logger.warn('[TokenRefreshHandler] 리프레시 토큰 없음 또는 만료됨');

      const noRefreshError = createReadableError(error);
      queue.rejectQueue(noRefreshError);
      useTokenStore.getState().clearTokens();

      const { useAlertStore } = await import('@/shared/store');
      useAlertStore.getState().showAuthError(noRefreshError.message);

      const errorHandler = originalRequest?._onError || defaultErrorHandler;
      const transformedData = errorHandler(noRefreshError);
      return { data: transformedData, error: noRefreshError };
    }

    // 5-2. 토큰 갱신 API 호출
    const { authApi } = await import('@/shared/auth');
    const refreshResponse = await authApi.refresh(refreshToken);

    logger.info('[TokenRefreshHandler] 토큰 갱신 성공');

    const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn } = refreshResponse;

    // 새 토큰 저장
    if (newRefreshToken) {
      useTokenStore
        .getState()
        .setTokens(newAccessToken, newRefreshToken, expiresIn, refreshResponse.refreshExpiresIn || 7 * 24 * 60 * 60);
    } else {
      useTokenStore.getState().setAccessToken(newAccessToken, expiresIn);
    }

    // 대기 중인 모든 요청 처리
    queue.processQueue((failedRequest) => {
      try {
        failedRequest.resolve(apiClient(failedRequest.config));
      } catch (err) {
        logger.error('[TokenRefreshHandler] 대기 중인 요청 처리 실패:', err.message);
        failedRequest.reject(err);
      }
    });

    // 원본 요청 재시도
    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
    return apiClient(originalRequest);
  } catch (refreshError) {
    // 5-3. 토큰 갱신 실패 → 로그아웃
    logger.error('[TokenRefreshHandler] 토큰 갱신 실패:', refreshError.message);

    const { useTokenStore } = await import('@/shared/auth');
    useTokenStore.getState().clearTokens();
    const readableError = createReadableError(refreshError);

    const { useAlertStore } = await import('@/shared/store');
    useAlertStore.getState().showAuthError(readableError.message);

    // 대기 중인 모든 요청 거부
    queue.rejectQueue(readableError);

    const errorHandler = originalRequest?._onError || defaultErrorHandler;
    const transformedData = errorHandler(readableError);
    return { data: transformedData, error: readableError };
  } finally {
    queue.setRefreshing(false);
  }
};

/**
 * 토큰 갱신 큐 인스턴스 반환 (테스트 용도)
 * @returns {TokenRefreshQueue}
 */
export const getRefreshQueue = () => getRefreshQueueInstance();

/**
 * 토큰 갱신 큐 인스턴스 반환 (테스트 용도)
 * @returns {TokenRefreshQueue}
 */
