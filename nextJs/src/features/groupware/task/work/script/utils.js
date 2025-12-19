/**
 * @fileoverview 프로젝트관리 관련 유틸리티 함수
 * @description 날짜 포맷팅 및 데이터 변환 유틸리티
 */

/**
 * ISO 8601 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param {string|Date} date - 포맷팅할 날짜
 * @returns {string} 포맷팅된 날짜 문자열 (YYYY-MM-DD)
 */
export const formatDate = function (date) {
  if (!date) {
    return '-';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Invalid Date 체크
    if (Number.isNaN(dateObj.getTime())) {
      return '-';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return '-';
  }
};

/**
 * Date 객체를 YYYY-MM-DD 형식 문자열로 변환 (API 전송용)
 * @param {Date|null} date - Date 객체
 * @returns {string|null} YYYY-MM-DD 형식 문자열 또는 null
 */
export const dateToString = function (date) {
  if (!date || !(date instanceof Date)) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식 문자열을 Date 객체로 변환 (Form 표시용)
 * @param {string|null} dateString - YYYY-MM-DD 형식 문자열
 * @returns {Date|null} Date 객체 또는 null
 */
export const stringToDate = function (dateString) {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * 숫자를 천 단위 콤마로 포맷팅
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumber = function (num) {
  if (num === null || num === undefined) {
    return '-';
  }

  return num.toLocaleString('ko-KR');
};

/**
 * 프로젝트 진행 기간 계산 (일수)
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @returns {number} 진행 기간 (일)
 */
export const calculateDuration = function (startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
