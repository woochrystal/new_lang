/**
 * @fileoverview HTTP 관련 공통 상수 정의
 * @description HTTP 상태 코드, 메서드, 에러 코드 등 네트워크 통신 관련 상수
 */

/**
 * HTTP 상태 코드 상수
 */
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

/**
 * HTTP 메서드 상수
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
};

/**
 * Content-Type 헤더 상수
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
  HTML: 'text/html'
};

/**
 * API 에러 코드 상수
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * HTTP 상태 코드별 에러 코드 매핑
 */
export const STATUS_ERROR_MAP = {
  [HTTP_STATUS.BAD_REQUEST]: ERROR_CODES.VALIDATION_ERROR,
  [HTTP_STATUS.UNAUTHORIZED]: ERROR_CODES.UNAUTHORIZED,
  [HTTP_STATUS.FORBIDDEN]: ERROR_CODES.FORBIDDEN,
  [HTTP_STATUS.NOT_FOUND]: ERROR_CODES.NOT_FOUND,
  [HTTP_STATUS.TOO_MANY_REQUESTS]: ERROR_CODES.TOO_MANY_REQUESTS,
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_CODES.UNKNOWN_ERROR,
  [HTTP_STATUS.BAD_GATEWAY]: ERROR_CODES.SERVICE_UNAVAILABLE,
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: ERROR_CODES.SERVICE_UNAVAILABLE,
  [HTTP_STATUS.GATEWAY_TIMEOUT]: ERROR_CODES.SERVICE_UNAVAILABLE
};

/**
 * 에러 타입별 제목 매핑
 */
export const ERROR_TITLES = {
  [ERROR_CODES.NETWORK_ERROR]: '네트워크 오류',
  [ERROR_CODES.TIMEOUT_ERROR]: '요청 시간 초과',
  [ERROR_CODES.UNAUTHORIZED]: '인증 실패',
  [ERROR_CODES.FORBIDDEN]: '권한 없음',
  [ERROR_CODES.NOT_FOUND]: '찾을 수 없음',
  [ERROR_CODES.VALIDATION_ERROR]: '입력값 오류',
  [ERROR_CODES.TOO_MANY_REQUESTS]: '요청 제한',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: '서버 오류',
  [ERROR_CODES.UNKNOWN_ERROR]: '알 수 없는 오류'
};

/**
 * 에러 코드별 사용자 대상 메시지
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.VALIDATION_ERROR]: '잘못된 요청입니다. 입력 정보를 확인해주세요.',
  [ERROR_CODES.UNAUTHORIZED]: '인증이 필요합니다. 다시 로그인해주세요.',
  [ERROR_CODES.FORBIDDEN]: '접근 권한이 없습니다.',
  [ERROR_CODES.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ERROR_CODES.TOO_MANY_REQUESTS]: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  [ERROR_CODES.NETWORK_ERROR]: '서버에 연결할 수 없습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.',
  [ERROR_CODES.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: '서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
  [ERROR_CODES.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.'
};
