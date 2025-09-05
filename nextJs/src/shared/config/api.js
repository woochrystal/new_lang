/**
 * API 설정 상수
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  TIMEOUT: parseInt(process.env.API_TIMEOUT) || 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
};
