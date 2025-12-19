/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷 (LocalDate용)
 * @param {string|Date} dateString - 날짜 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜 문자열 (예: "2024-10-29")
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  try {
    // LocalDate 형식 (YYYY-MM-DD)이 이미 올바른 형식인 경우
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // ISO 형식인 경우 Date 객체로 변환
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('formatDate error:', error);
    return dateString;
  }
};

/**
 * 날짜시간을 YYYY-MM-DD HH:mm:ss 형식으로 포맷 (LocalDateTime용)
 * @param {string|Date} dateTimeString - 날짜시간 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜시간 문자열 (예: "2024. 10. 29. 오후 3:30:00")
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) {
    return '';
  }
  const date = new Date(dateTimeString);
  return date.toLocaleString('ko-KR');
};

/**
 * 전화번호 자동 포맷팅 (하이픈 자동 삽입)
 * @param {string} value - 입력된 전화번호
 * @returns {string} 포맷팅된 전화번호 (예: "010-1234-5678", "02-1234-5678")
 */
export const formatPhoneNumber = (value) => {
  if (!value) {
    return '';
  }

  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');

  // 길이 제한 (최대 11자리)
  const limitedNumbers = numbers.slice(0, 11);

  // 길이에 따라 포맷팅
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 10) {
    // 02 지역번호인 경우 (서울)
    if (limitedNumbers.startsWith('02')) {
      return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    }
    // 일반 지역번호 (031, 051 등)
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
  } else {
    // 11자리 (휴대폰)
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

/**
 * 카드번호 자동 포맷팅 (4자리마다 하이픈 자동 삽입)
 * @param {string} value - 입력된 카드번호
 * @returns {string} 포맷팅된 카드번호 (예: "1234-5678-9012-3456")
 */
export const formatCardNumber = (value) => {
  if (!value) {
    return '';
  }

  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');

  // 길이 제한 (최대 16자리)
  const limitedNumbers = numbers.slice(0, 16);

  // 길이에 따라 포맷팅 (4자리씩 하이픈 삽입)
  if (limitedNumbers.length <= 4) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4, 8)}-${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4, 8)}-${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12)}`;
  }
};

/**
 * 금액 자동 포맷팅 (천단위 콤마 자동 삽입)
 * @param {string|number} value - 입력된 금액
 * @returns {string} 포맷팅된 금액 (예: "1,000", "1,234,567")
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) {
    return '';
  }

  // 숫자만 추출
  const numbers = String(value).replace(/[^\d]/g, '');

  // 빈 문자열이면 0 반환
  if (numbers === '') {
    return '0';
  }

  // 앞의 0 제거 (단, "0"만 있는 경우는 유지)
  const trimmedNumbers = numbers.replace(/^0+/, '') || '0';

  // 천단위 콤마 삽입
  return trimmedNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 포맷팅된 금액 문자열을 숫자로 변환
 * @param {string} value - 콤마가 포함된 금액 문자열 (예: "1,000", "1,234,567")
 * @returns {number} 숫자로 변환된 금액
 */
export const parseCurrency = (value) => {
  if (!value && value !== 0) {
    return 0;
  }

  // 콤마 제거 후 숫자로 변환
  const numbers = String(value).replace(/[^\d]/g, '');
  return numbers === '' ? 0 : parseInt(numbers, 10);
};

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환 (백엔드 LocalDate 전송용)
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열 (예: "2024-10-29")
 */
export const formatDateToLocalDate = (date) => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 결재 승인 날짜/시간 포맷팅
 * @param {string|Date} dateTimeString - 날짜시간 문자열 또는 Date 객체
 * @param {boolean} asObject - true일 경우 {date, time} 객체로 반환, false일 경우 문자열로 반환
 * @returns {string|Object} 포맷된 날짜시간 문자열 (예: "2025-11-21 00:41:54") 또는 {date: "2025-11-21", time: "00:41:54"} 객체
 */
export const formatApprovalDateTime = (dateTimeString, asObject = false) => {
  if (!dateTimeString) {
    return asObject ? { date: '-', time: '' } : '-';
  }

  const dt = new Date(dateTimeString);
  const year = dt.getFullYear();
  const month = `0${dt.getMonth() + 1}`.slice(-2);
  const day = `0${dt.getDate()}`.slice(-2);
  const hour = `0${dt.getHours()}`.slice(-2);
  const minutes = `0${dt.getMinutes()}`.slice(-2);
  const seconds = `0${dt.getSeconds()}`.slice(-2);

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hour}:${minutes}:${seconds}`;

  if (asObject) {
    return {
      date: dateStr,
      time: timeStr
    };
  }

  return `${dateStr} ${timeStr}`;
};
