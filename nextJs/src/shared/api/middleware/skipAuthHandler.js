/*
 * path           : src\/shared\/api\/middleware\/skipAuthHandler.js
 * fileName       : skipAuthHandler
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : 공개 페이지의 인증 리다이렉트 제외 처리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 */

import { LoggerFactory } from '@/shared/lib';

import { HTTP_STATUS } from '../constants';

const logger = LoggerFactory.getLogger('SkipAuthHandler');

/**
 * X-Skip-Auth-Redirect 헤더가 있는 401 에러 처리
 *
 * @param {import('axios').AxiosError} error - 에러 객체
 * @param {Function} createReadableError - 사용자 대상 에러 생성 함수
 * @returns {Promise<{data: any, error: Error}> | null} 처리 결과 또는 null (다른 핸들러로 진행)
 *
 * @example
 * const result = handleSkipAuthRedirect(error, createReadableError);
 * if (result) return result; // 이 핸들러에서 처리함
 */
export const handleSkipAuthRedirect = (error, createReadableError) => {
  const skipRedirect = error.config?.headers?.['X-Skip-Auth-Redirect'] === 'true';

  if (skipRedirect && error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    logger.info('[SkipAuthHandler] 인증 리다이렉트 건너뜀 (X-Skip-Auth-Redirect=true)');

    const readableError = createReadableError(error);
    const { config: originalRequest } = error;

    // _onError 콜백이 있으면 실행
    const errorHandler = originalRequest._onError || (() => null);
    const transformedData = errorHandler(readableError);

    // _finally 콜백 실행
    if (originalRequest._finally) {
      originalRequest._finally();
    }

    return Promise.resolve({ data: transformedData, error: readableError });
  }

  return null; // 다른 핸들러로 넘김
};
