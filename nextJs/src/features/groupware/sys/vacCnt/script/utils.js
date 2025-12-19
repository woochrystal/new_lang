/**
 * @fileoverview VacCnt 유틸리티 함수
 * @description 휴가일수관리 기능에서 사용하는 유틸리티 함수들
 */

/**
 * 날짜 포맷팅 (YYYY-MM-DD 형식)
 * @param {string|Date} date - 포맷팅할 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (date) => {
  if (!date) {
    return '-';
  }

  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return '-';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return '-';
  }
};

/**
 * 소수점 첫째자리까지 포맷팅
 * @param {number} value - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatDecimal = (value) => {
  if (value === null || value === undefined) {
    return '0.0';
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    return '0.0';
  }

  return num.toFixed(1);
};

/**
 * 남은 휴가일수 계산
 * @param {number} totalDays - 총 휴가일수
 * @param {number} usedDays - 사용한 휴가일수
 * @returns {number} 남은 휴가일수
 */
export const calculateRemainingDays = (totalDays, usedDays) => {
  const total = Number(totalDays) || 0;
  const used = Number(usedDays) || 0;
  const remaining = total - used;

  return Math.max(0, Number(remaining.toFixed(1)));
};

/**
 * 휴가 사용률 계산 (%)
 * @param {number} totalDays - 총 휴가일수
 * @param {number} usedDays - 사용한 휴가일수
 * @returns {number} 사용률 (0-100)
 */
export const calculateUsageRate = (totalDays, usedDays) => {
  const total = Number(totalDays) || 0;
  const used = Number(usedDays) || 0;

  if (total === 0) {
    return 0;
  }

  const rate = (used / total) * 100;
  return Math.min(100, Number(rate.toFixed(1)));
};

/**
 * 휴가 사용률에 따른 색상 클래스 반환
 * @param {number} usageRate - 사용률 (0-100)
 * @returns {string} 색상 클래스명
 */
export const getUsageRateColor = (usageRate) => {
  if (usageRate >= 90) {
    return 'danger';
  } // 90% 이상
  if (usageRate >= 70) {
    return 'warning';
  } // 70-89%
  if (usageRate >= 50) {
    return 'info';
  } // 50-69%
  return 'success'; // 50% 미만
};

/**
 * 입력값을 숫자로 변환 (소수점 첫째자리까지)
 * @param {string|number} value - 변환할 값
 * @returns {number|null} 변환된 숫자 (유효하지 않으면 null)
 */
export const parseDecimalInput = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    return null;
  }

  // 소수점 첫째자리까지만 유지
  return Number(num.toFixed(1));
};

/**
 * 년도 목록 생성
 * @param {number} startYear - 시작 년도
 * @param {number} endYear - 종료 년도
 * @returns {Array<{value: number, label: string}>}
 */
export const generateYearOptions = (startYear, endYear) => {
  const years = [];

  for (let year = endYear; year >= startYear; year--) {
    years.push({
      value: year,
      label: `${year}`
    });
  }

  return years;
};

/**
 * 검색 파라미터 정리 (빈 값 제거)
 * @param {Object} params - 검색 파라미터
 * @returns {Object} 정리된 파라미터
 */
export const cleanSearchParams = (params) => {
  const cleaned = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];

    // null, undefined, 빈 문자열 제외
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
};
