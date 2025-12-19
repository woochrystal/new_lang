/*
 * path           : src/shared/config/api.js
 * fileName       : api
 * author         : changhyeon
 * date           : 25. 10. 22.
 * description    : API 서버 설정 상수 (BASE_URL, TIMEOUT, HEADERS)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 22.       changhyeon       최초 생성
 * 25. 11. 11.       changhyeon       파일 헤더 추가
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: parseInt(process.env.API_TIMEOUT) || 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
};
