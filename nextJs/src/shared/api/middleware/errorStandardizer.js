/*
 * path           : src/shared/api/middleware/errorStandardizer.js
 * fileName       : errorStandardizer
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : HTTP 에러 표준화 및 사용자가 이해 가능한 메시지로 변환
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 07.       changhyeon       인증 우회시 백엔드 데이터 모킹 처리
 */

import axios from 'axios';

import { shouldBypassAuth } from '@/shared/auth';
import { LoggerFactory } from '@/shared/lib';

import { ERROR_CODES, STATUS_ERROR_MAP, ERROR_MESSAGES, ERROR_TITLES } from '../constants';

const logger = LoggerFactory.getLogger('ErrorStandardizer');

/**
 * API 에러를 사용자 대상 형식으로 표준화
 *
 * @param {import('axios').AxiosError} error - Axios 에러 객체
 * @returns {Error} 표준화된 에러 객체 (title, message, code, status 속성 포함)
 *
 * @example
 * try {
 *   await apiClient.get('/api/users');
 * } catch (error) {
 *   const readableError = standardizeError(error);
 *   console.log(readableError.title);    // '인증 실패'
 *   console.log(readableError.message);  // '인증이 필요합니다.'
 *   console.log(readableError.code);     // 'UNAUTHORIZED'
 * }
 */
export const standardizeError = (error) => {
  // 0. axios 요청 취소 처리
  if (axios.isCancel(error)) {
    return createCanceledError(error);
  }

  let errorCode = ERROR_CODES.UNKNOWN_ERROR;
  let message = ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];

  // 1. 네트워크 에러 처리
  if (isNetworkError(error)) {
    errorCode = ERROR_CODES.NETWORK_ERROR;
    message = ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
  }
  // 2. 타임아웃 에러 처리
  else if (error.code === 'ECONNABORTED') {
    errorCode = ERROR_CODES.TIMEOUT_ERROR;
    message = ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR];
  }
  // 3. HTTP 상태 코드별 처리
  else if (error.response?.status) {
    const { status, data } = error.response;
    errorCode = STATUS_ERROR_MAP[status] || ERROR_CODES.UNKNOWN_ERROR;
    message = data?.message || ERROR_MESSAGES[errorCode];
  }

  return createReadableError(errorCode, message, error);
};

const createCanceledError = (error) => {
  logger.debug('[API] 요청이 사용자에 의해 취소됨:', error.message);
  const canceledError = new Error('요청이 취소되었습니다.');
  canceledError.code = 'CANCELED';
  canceledError.title = '요청 취소됨';
  canceledError.message = '요청이 취소되었습니다.';
  canceledError.isUserCanceled = true;
  canceledError.originalError = error;
  canceledError.timestamp = Date.now();
  return canceledError;
};

const isNetworkError = (error) => {
  return error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response;
};

const createReadableError = (errorCode, message, originalError) => {
  const readableError = new Error(message);
  readableError.code = errorCode;
  readableError.title = ERROR_TITLES[errorCode] || ERROR_TITLES[ERROR_CODES.UNKNOWN_ERROR];
  readableError.message = message;
  readableError.status = originalError.response?.status;
  readableError.originalError = originalError;
  readableError.isUserFriendly = true;
  readableError.timestamp = Date.now();
  readableError.autoClose = getAutoCloseSetting(errorCode, originalError);
  return readableError;
};

const getAutoCloseSetting = (errorCode, _error) => {
  if (errorCode === ERROR_CODES.TIMEOUT_ERROR) {
    return 3000;
  }
  return null;
};

/**
 * 기본 에러 핸들러
 * GlobalErrorAlert에 자동으로 에러 표시
 *
 * @param {Error} readableError - 표준화된 에러 객체
 * @returns {null}
 *
 * @example
 * const errorHandler = originalRequest._onError || defaultErrorHandler;
 * errorHandler(readableError);
 */
export const defaultErrorHandler = (readableError) => {
  // BYPASS_AUTH 모드의 네트워크 에러는 무시 (Mock 데이터로 대체되었으므로 문제없음)
  if (shouldBypassAuth() && readableError.code === ERROR_CODES.NETWORK_ERROR) {
    logger.debug('[DEV] BYPASS_AUTH 모드의 네트워크 에러 무시:', readableError.message);
    return null;
  }

  // 운영 환경에서 UNKNOWN_ERROR 상세 로깅
  if (process.env.NODE_ENV === 'production' && readableError.code === ERROR_CODES.UNKNOWN_ERROR) {
    logger.error('[API Error] UNKNOWN_ERROR 발생. 상세 정보: {}', {
      message: readableError.originalError?.message,
      stack: readableError.originalError?.stack,
      request: {
        method: readableError.originalError?.config?.method,
        url: readableError.originalError?.config?.url
      },
      response: {
        status: readableError.originalError?.response?.status,
        data: readableError.originalError?.response?.data
      }
    });
  }

  const { useAlertStore } = require('../../store/alertStore');
  useAlertStore.getState().showError({
    title: readableError.title,
    message: readableError.message,
    autoClose: readableError.autoClose,
    timestamp: readableError.timestamp
  });
  return null;
};
