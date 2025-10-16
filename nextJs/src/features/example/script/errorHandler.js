import { LoggerFactory } from '@/shared/lib/logger';

const logger = LoggerFactory.getLogger('ErrorHandler');

/**
 * 일반 에러 타입 정의
 */
export const GENERIC_ERROR_TYPES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * 비상시 사용될 최소한의 사용자 친화적 에러 메시지
 * (백엔드에서 메시지를 제공하지 않을 경우에만 사용)
 */
export const FALLBACK_ERROR_MESSAGES = {
  [GENERIC_ERROR_TYPES.UNAUTHORIZED]: {
    title: '인증 실패',
    message: '로그인이 필요하거나 세션이 만료되었습니다.'
  },
  [GENERIC_ERROR_TYPES.FORBIDDEN]: {
    title: '권한 없음',
    message: '이 작업을 수행할 권한이 없습니다.'
  },
  [GENERIC_ERROR_TYPES.NOT_FOUND]: {
    title: '찾을 수 없음',
    message: '요청하신 리소스를 찾을 수 없습니다.'
  },
  [GENERIC_ERROR_TYPES.VALIDATION_ERROR]: {
    title: '입력값 오류',
    message: '입력하신 정보를 다시 확인해주세요.'
  },
  [GENERIC_ERROR_TYPES.NETWORK_ERROR]: {
    title: '네트워크 오류',
    message: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
  },
  [GENERIC_ERROR_TYPES.SERVER_ERROR]: {
    title: '서버 오류',
    message: '일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  },
  [GENERIC_ERROR_TYPES.UNKNOWN_ERROR]: {
    title: '알 수 없는 오류',
    message: '예상치 못한 오류가 발생했습니다.'
  }
};

/**
 * API 에러 핸들러 클래스
 */
export class EnhancedErrorHandler {
  /**
   * API 에러를 파싱하여 UI에 표시할 형태로 가공합니다.
   * 백엔드에서 받은 메시지를 우선적으로 사용합니다.
   * @param {Object} error - API 에러 객체 (axios error)
   * @returns {{title: string, message: string, type: string, originalError: Object}}
   */
  static handleApiError(error) {
    logger.error('API 에러 발생: {}', error.message, error);

    // 1. 네트워크 에러 (백엔드 응답이 없는 경우)
    if (!error.response) {
      return {
        ...FALLBACK_ERROR_MESSAGES[GENERIC_ERROR_TYPES.NETWORK_ERROR],
        type: GENERIC_ERROR_TYPES.NETWORK_ERROR,
        originalError: error
      };
    }

    const { status, data } = error.response;

    // 2. 백엔드에서 명시적인 에러 메시지를 제공하는 경우
    if (data && data.message) {
      return {
        title: data.title || '오류 발생', // 백엔드에서 title을 주면 사용, 아니면 기본값
        message: data.message,
        type: data.error || `HTTP_${status}`,
        originalError: error
      };
    }

    // 3. 백엔드 메시지가 없는 경우, HTTP 상태 코드로 폴백 메시지 생성
    let errorType;
    switch (status) {
      case 400:
        errorType = GENERIC_ERROR_TYPES.VALIDATION_ERROR;
        break;
      case 401:
        errorType = GENERIC_ERROR_TYPES.UNAUTHORIZED;
        break;
      case 403:
        errorType = GENERIC_ERROR_TYPES.FORBIDDEN;
        break;
      case 404:
        errorType = GENERIC_ERROR_TYPES.NOT_FOUND;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorType = GENERIC_ERROR_TYPES.SERVER_ERROR;
        break;
      default:
        errorType = GENERIC_ERROR_TYPES.UNKNOWN_ERROR;
        break;
    }

    return {
      ...FALLBACK_ERROR_MESSAGES[errorType],
      type: errorType,
      originalError: error
    };
  }
}

export default EnhancedErrorHandler;
