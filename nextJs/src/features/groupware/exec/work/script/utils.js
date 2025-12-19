/**
 * @fileoverview 프로젝트현황 관련 유틸리티 함수
 * @description 날짜 포맷팅 및 기간 계산 유틸리티
 */

/**
 * ISO 8601 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param {string|Date} date - 포맷팅할 날짜
 * @returns {string} 포맷팅된 날짜 문자열 (YYYY-MM-DD)
 */
export const formatDate = (date) => {
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
 * 시작일과 종료일로 기간 문자열 생성
 * @param {string|Date} startDate - 시작일
 * @param {string|Date} endDate - 종료일
 * @returns {string} "YYYY-MM-DD ~ YYYY-MM-DD" 형식의 기간 문자열
 */
export const formatPeriod = (startDate, endDate) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start === '-' && end === '-') {
    return '-';
  }

  return `${start} ~ ${end}`;
};

/**
 * 개월수를 표시용 문자열로 변환
 * @param {string|number} months - 개월수
 * @returns {string} "N개월" 형식의 문자열
 */
export const formatMonths = (months) => {
  if (!months) {
    return '-';
  }
  return `${months}개월`;
};
