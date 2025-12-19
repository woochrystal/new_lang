/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환합니다.
 * @param {string} dateString - 변환할 날짜 문자열 (e.g., ISO 8601 형식)
 * @returns {string} YYYY-MM-DD 형식의 문자열 또는 원본 문자열
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return dateString; // 변환 실패 시 원본 반환
  }
};
