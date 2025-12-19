'use client';

/*
 * path           : src/shared/api/client.js
 * fileName       : client
 * author         : changhyeon
 * date           : 25. 09. 02.
 * description    : Axios 기반 API 클라이언트 (토큰/테넌트 헤더 자동 추가, 에러 핸들러 체인)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 09. 02.       changhyeon       최초 생성
 * 25. 09. 02.       changhyeon       Axios API 모듈 추가
 * 25. 09. 12.       changhyeon       에러 메시지 처리 및 로그인, 권한관리 기능 추가
 * 25. 10. 16.       changhyeon       샘플 개선, hook으로 alert 사용, 공통에러 처리
 * 25. 10. 22.       changhyeon       로그인 및 인증 401오류 발생시 오류처리 개선
 * 25. 10. 23.       changhyeon       api 클라이언트 사용법 개선, 전역 오류처리 통합, function expression으로 코드 통일
 * 25. 10. 24.       changhyeon       api 클라이언트 사용시 try-catch를 사용하지 않도록 수정
 * 25. 10. 29.       changhyeon       ellipsis 믹스인, Content 래퍼 수정, hr기반 디바이더 추가
 * 25. 11. 07.       changhyeon       인증 우회시 백엔드 데이터 모킹 처리
 * 25. 11. 07.       changhyeon       레이스 컨디션 방지를 위한 하이드레이션 가드 추가
 * 25. 11. 11.       changhyeon       axios-retry 설정 추가 (네트워크/5xx 에러 자동 재시도)
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';

/**
 * @typedef {Object} ApiConfig
 * @property {Function} [_onSuccess] - 성공 응답 변환 콜백
 * @property {Function} [_onError] - 에러 응답 변환 콜백
 */

import { shouldBypassAuth } from '@/shared/auth/utils/devMode';
import { LoggerFactory, isMultiTenantMode } from '@/shared/lib';
import { useTokenStore, useTenantStore } from '@/shared/store';

import { API_CONFIG } from './config';
import { CONTENT_TYPES } from './constants';
import { standardizeError, defaultErrorHandler } from './middleware/errorStandardizer';
import { handleSkipAuthRedirect } from './middleware/skipAuthHandler';
import { handleTenantMismatch } from './middleware/tenantMismatchHandler';
import { handleTokenRefresh } from './middleware/tokenRefreshHandler';
import { getMockResponse } from './mock/mockService';

// 로거 인스턴스 생성
const logger = LoggerFactory.getLogger('ApiClient');

// 테넌트 ID가 불필요한 경로 설정
// 테넌트 ID가 불필요한 경로들 (기본값 + 환경변수에서 추가 값)
// 환경변수에서 테넌트 ID 미필수 경로들을 읽음
// 예: /health,/version,/api/auth/login,/api/auth/refresh,/api/tenants
const TENANT_EXEMPT_PATHS = (process.env.NEXT_PUBLIC_TENANT_EXEMPT_PATHS || '')
  .split(',')
  .map((path) => path.trim())
  .filter((path) => path.length > 0);

/**
 * API 요청/응답을 처리하는 axios 인스턴스
 *
 * Request: 자동으로 토큰과 테넌트 ID 헤더를 붙임
 * Response: 401이면 토큰 갱신, 에러는 사용자 대상 메시지로 변환
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON
  }
});

/**
 * axios-retry 설정
 *
 * 네트워크 에러, CORS 에러, 5xx 서버 에러 시 자동 재시도
 * - 최대 3회 재시도
 * - Exponential backoff: 1초 → 2초 → 4초
 * - 총 최대 대기 시간: ~47초 (10초 timeout × 4회 + 지연 시간)
 *
 * 멱등성이 보장되는 요청만 재시도합니다.
 * - 최대 3회 재시도
 * - Exponential backoff: 1초 → 2초 → 4초
 *
 * 재시도 대상:
 * - GET, HEAD, OPTIONS, PUT, DELETE (멱등성 보장)
 * - 503 Service Unavailable (일시적 서버 점검)
 * - 429 Too Many Requests (레이트 제한, 회복 가능)
 * - 네트워크 에러 (ECONNABORTED, ERR_NETWORK 등)
 *
 * 재시도 제외:
 * - POST, PATCH (멱등성 미보장)
 * - 400, 401, 403, 404, 5xx (500, 502) - 클라이언트 오류나 서버 오류
 */
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const method = error.config?.method?.toUpperCase() || '';
    const status = error.response?.status;

    // 재시도 우선순위:
    // 1. 네트워크 에러 (일시적 단절 대비) → 무조건 재시도
    // 2. 멱등성 확인 (POST는 재시도 안 함) → 안전성 보장
    // 3. HTTP 상태 코드 (5xx, 429만) → 회복 가능한 에러만

    // 1. 네트워크 에러는 재시도 (일시적 단절 대비)
    if (axiosRetry.isNetworkError(error)) {
      logger.warn('[API Retry] 네트워크 오류 발생. 재시도를 시작합니다: {}', error.message);
      return true;
    }

    // 2. 멱등성이 보장되지 않는 메서드는 재시도 하지 않음
    const idempotentMethods = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
    if (!idempotentMethods.includes(method)) {
      return false;
    }

    // 3. HTTP 상태 코드 기반 재시도 판단
    if (status) {
      // 5xx 서버 오류: 일시적 문제일 수 있으므로 재시도
      if (status >= 500 && status < 600) {
        return true;
      }
      // 429 Too Many Requests: 레이트 제한, 회복 가능
      if (status === 429) {
        return true;
      }
    }

    // 그 외 모든 경우는 재시도하지 않음
    return false;
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn('[API Retry] 재시도 {}/3 - {} {}', retryCount, requestConfig.method?.toUpperCase(), requestConfig.url);
  }
});

/**
 * BYPASS_AUTH 모드: Mock Adapter 설정
 *
 * BYPASS_AUTH=true일 때 axios의 adapter를 교체하여 실제 네트워크 요청을 차단하고
 * Mock 데이터를 즉시 반환합니다.
 */
if (typeof window !== 'undefined' && shouldBypassAuth()) {
  apiClient.defaults.adapter = (config) => {
    logger.debug(`[Mock] Intercepting request: ${config.method?.toUpperCase()} ${config.url}`);
    const mockResponse = getMockResponse(config.method?.toUpperCase() || 'GET', config.url);

    return Promise.resolve({
      data: mockResponse.data,
      status: mockResponse.status || 200,
      statusText: mockResponse.statusText || 'OK',
      headers: mockResponse.headers || {},
      config,
      request: {}
    });
  };
}

/**
 * Request Interceptor
 *
 * - 토큰을 Authorization 헤더에 추가
 * - 테넌트 ID를 X-Tenant-ID 헤더에 추가
 * - 요청 body의 _onSuccess, _onError 같은 내부 콜백은 백엔드로 보내지 않고 config로 이동
 */
apiClient.interceptors.request.use(
  /** @param {import('axios').AxiosRequestConfig & ApiConfig} config */
  (config) => {
    const { accessToken } = useTokenStore.getState();

    // 토큰 첨부
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // CSRF 토큰 첨부 (POST/PUT/PATCH/DELETE 요청)
    const method = config.method?.toUpperCase() || '';
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      } else {
        logger.debug('[API Client] CSRF token not found in meta tag');
      }
    }

    // 멀티테넌트 모드일 경우, 테넌트 ID를 헤더에 추가
    if (isMultiTenantMode()) {
      const { currentTenant } = useTenantStore.getState(); // tenantStore에서 테넌트 정보 가져오기
      const tenantId = currentTenant?.id; // getTenantId() 대신 authStore의 인증된 값 사용
      const requestPath = config.url || '';

      // 예외 경로 확인 (테넌트 ID가 불필요한 API)
      const isExemptPath = TENANT_EXEMPT_PATHS.some((path) => {
        if (path.includes('*')) {
          const pattern = path.replace(/\*/g, '[^/]+');
          const regex = new RegExp(`^${pattern}`);
          return regex.test(requestPath);
        }
        return requestPath.startsWith(path);
      });

      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
      } else if (!isExemptPath) {
        // 예외 경로가 아닌데 tenantId가 없으면 요청 거부
        logger.error('[API Client] 테넌트 ID가 필요하지만 누락되었습니다. URL:{}', requestPath);
        throw new Error('다중 테넌트 모드에서 이 요청에는 테넌트 ID가 필요합니다.');
      }
    }

    // _onSuccess, _onError 같은 콜백은 백엔드로 보내면 안 되므로 config로 옮겨서 제거
    if (config.data && typeof config.data === 'object') {
      Object.keys(config.data).forEach((key) => {
        if (key.startsWith('_')) {
          // config로 복사 (Response Interceptor에서 접근 가능)
          config[key] = config.data[key];
          // data에서 제거 (백엔드로 전송 안함)
          delete config.data[key];
        }
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * 성공: _onSuccess 콜백으로 응답 데이터 변환
 * 에러: 여러 핸들러가 우선순위대로 처리
 *   1. skipAuthHandler - X-Skip-Auth-Redirect 있는 401은 그냥 반환 (로그인 페이지 같은 곳)
 *   2. tenantMismatchHandler - 403 + TENANT_MISMATCH면 강제 로그아웃
 *   3. tokenRefreshHandler - 일반 401이면 토큰 갱신 시도
 *   4. 기본 처리 - 그 외 에러는 사용자 대상 메시지로 변환
 */
apiClient.interceptors.response.use(
  (response) => {
    // response.config가 없는 경우처리
    if (!response.config) {
      logger.error('[API Client] response.config가 없습니다. 응답: {}', response);
      // config가 없으면 _onSuccess를 찾을 수 없으므로 기본적으로 data를 반환하거나 에러 처리
      return { data: response.data, error: null };
    }

    // _onSuccess 콜백 필수 (반드시 정의되어야 함)
    const successHandler = response.config._onSuccess;
    if (!successHandler) {
      const apiUrl = response.config.url;
      throw new Error(
        `[API Client] _onSuccess 콜백이 필요합니다.\n` +
          `요청 URL: ${apiUrl}\n` +
          `사용법: apiClient.get(url, { _onSuccess: (response) => response.data })`
      );
    }

    const transformedData = successHandler(response);

    // _finally 콜백 실행 (항상 실행되는 정리 작업)
    if (response.config._finally) {
      response.config._finally();
    }

    return { data: transformedData, error: null };
  },
  async (error) => {
    /**
     * 에러 핸들러 체인 패턴
     *
     * 각 핸들러가 처리 가능하면 {data, error}를 반환하고, 아니면 null을 반환해서
     * 다음 핸들러로 넘김. 이렇게 하면 if-else 지옥을 피할 수 있음.
     *
     * 우선순위:
     * 1. skipAuthHandler (X-Skip-Auth-Redirect 있는 401)
     * 2. tenantMismatchHandler (403 + TENANT_MISMATCH)
     * 3. tokenRefreshHandler (일반 401)
     * 4. 기본 처리 (그 외 모든 에러)
     */

    // 1. X-Skip-Auth-Redirect가 있는 401 (로그인 페이지 같은 곳에서는 401이 정상)
    let result = handleSkipAuthRedirect(error, standardizeError);
    if (result) {
      return result;
    }

    // 2. 테넌트 불일치 감지 (강제 로그아웃)
    result = await handleTenantMismatch(error, standardizeError);
    if (result) {
      return result;
    }

    // 3. 토큰 자동 갱신 (일반적인 401)
    result = await handleTokenRefresh(error, apiClient, standardizeError, defaultErrorHandler);
    if (result) {
      return result;
    }

    // 4. 위 핸들러들에서 처리 안 된 에러는 여기서 기본 처리
    const { config: originalRequest } = error;
    const readableError = standardizeError(error);

    // 사용자 취소 에러는 무시 (사용자가 페이지를 떠남)
    if (readableError.code === 'CANCELED') {
      logger.debug('[API Client] 사용자 취소 에러 무시');
      if (originalRequest?._finally) {
        originalRequest._finally();
      }
      return Promise.resolve({ data: null, error: null });
    }

    logger.error('API 요청 실패: {} (코드: {})', readableError.message, readableError.code);

    // 네트워크 에러로 config가 없는 경우 안전하게 처리
    if (!originalRequest) {
      logger.warn('[API Client] 네트워크 에러 발생 - request config 없음:', error.message);
      defaultErrorHandler(readableError);

      // _finally 콜백이 있으면 호출 (로딩 상태 해제)
      if (error.config?._finally) {
        try {
          error.config._finally();
        } catch (finallyError) {
          logger.error('[API Client] _finally 콜백 실행 실패:', finallyError);
        }
      }

      return Promise.resolve({ data: null, error: readableError });
    }

    const errorHandler = originalRequest._onError || defaultErrorHandler;
    const transformedData = errorHandler(readableError);

    if (originalRequest._finally) {
      originalRequest._finally();
    }

    return Promise.resolve({ data: transformedData, error: readableError });
  }
);

// defaultErrorHandler를 인터셉터 핸들러에서 import해서 export
export { defaultErrorHandler } from './middleware/errorStandardizer';

export default apiClient;
