/**
 * @fileoverview JWT 토큰 관련 유틸리티 함수들
 * @description localStorage 기반 토큰 저장/로드/검증 유틸리티
 */

import { LoggerFactory } from '../lib/logger';

// 로거 인스턴스 생성
const logger = LoggerFactory.getLogger('TokenUtils');

/**
 * 토큰 만료 시간 검증 (백엔드 제공 expiresIn 기반)
 * @param {number} expirationTime - 만료 시간 (timestamp)
 * @returns {boolean} 유효성 여부
 */
export const isTokenValid = (expirationTime) => {
  if (!expirationTime || typeof expirationTime !== 'number') {
    return false;
  }

  // 만료 시간 5분 전까지를 유효로 판단 (갱신 여유 시간)
  const currentTime = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5분

  return expirationTime - bufferTime > currentTime;
};

/**
 * localStorage에서 토큰 데이터 로드
 * @returns {Object} 토큰 데이터 (토큰 + 만료시간)
 */
export const loadTokensFromStorage = () => {
  if (typeof window === 'undefined') {
    return {
      accessToken: null,
      refreshToken: null,
      accessTokenExpiration: null,
      refreshTokenExpiration: null
    };
  }

  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const accessTokenExpiration = localStorage.getItem('accessTokenExpiration');
    const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: accessTokenExpiration ? parseInt(accessTokenExpiration) : null,
      refreshTokenExpiration: refreshTokenExpiration ? parseInt(refreshTokenExpiration) : null
    };
  } catch (error) {
    logger.warn('토큰 로드 실패: {}', error);
    return {
      accessToken: null,
      refreshToken: null,
      accessTokenExpiration: null,
      refreshTokenExpiration: null
    };
  }
};

/**
 * localStorage에 토큰 데이터 저장
 * @param {string} accessToken - 액세스 토큰
 * @param {string} refreshToken - 리프레시 토큰
 * @param {number} accessExpiresIn - 액세스 토큰 만료 시간(초)
 * @param {number} refreshExpiresIn - 리프레시 토큰 만료 시간(초)
 */
export const saveTokensToStorage = (accessToken, refreshToken, accessExpiresIn, refreshExpiresIn) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const currentTime = Date.now();

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (accessExpiresIn) {
        const expiration = currentTime + accessExpiresIn * 1000;
        localStorage.setItem('accessTokenExpiration', expiration.toString());
      }
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExpiration');
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      if (refreshExpiresIn) {
        const expiration = currentTime + refreshExpiresIn * 1000;
        localStorage.setItem('refreshTokenExpiration', expiration.toString());
      }
    } else {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshTokenExpiration');
    }
  } catch (error) {
    logger.error('토큰 저장 실패: {}', error);
  }
};

/**
 * localStorage에서 토큰 데이터 제거
 */
export const clearTokensFromStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiration');
    localStorage.removeItem('refreshTokenExpiration');
  } catch (error) {
    logger.error('토큰 정리 실패: {}', error);
  }
};
