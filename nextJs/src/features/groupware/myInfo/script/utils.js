/**
 * @fileoverview 내정보 관련 유틸리티 함수
 */

/**
 * 전화번호 자동 포맷팅
 * 숫자만 입력받아 010-1234-5678 형식으로 변환
 * @param {string} value - 입력값
 * @returns {string} 포맷팅된 전화번호
 */
export const formatPhoneNumber = (value) => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');

  // 길이에 따라 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  }

  if (numbers.length <= 7) {
    // 010-1234
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }

  if (numbers.length <= 10) {
    // 010-123-4567 (10자리)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }

  // 010-1234-5678 (11자리)
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * 전화번호에서 하이픈 제거
 * @param {string} value - 전화번호
 * @returns {string} 숫자만 있는 전화번호
 */
export const removePhoneHyphens = (value) => {
  return value.replace(/[^\d]/g, '');
};
