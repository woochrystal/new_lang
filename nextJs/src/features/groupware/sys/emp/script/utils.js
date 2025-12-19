/**
 * @fileoverview Emp 관련 유틸리티 함수
 * @description 날짜 포맷팅, 상태 변환 등 범용 유틸리티
 */

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 * @param {string | undefined | null} dateString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 변환된 날짜 문자열
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return '-';
  }

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  } catch {
    return dateString;
  }
};

/**
 * 전화번호 포맷팅 (010-1234-5678) - 표시용
 * @param {string} phone - 전화번호
 * @returns {string} 포맷된 전화번호
 */
export const formatPhone = (phone) => {
  if (!phone) {
    return '-';
  }
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * 전화번호 자동 포맷팅 - 입력용
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
 * 근무 상태 배지 색상 반환
 * @param {string} status - 근무 상태
 * @returns {string} 배지 색상 클래스
 */
export const getStatusBadgeColor = (status) => {
  switch (status) {
    case '승인':
      return 'success';
    case '반려':
      return 'danger';
    case '미결':
      return 'warning';
    default:
      return 'default';
  }
};
