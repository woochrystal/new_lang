/**
 * 날짜 문자열 포맷팅
 * @param {string} dateString - ISO 8601 형식의 날짜 문자열
 * @returns {string} YYYY-MM-DD 형식의 날짜
 */
export const formatDate = function (dateString) {
  if (!dateString) {
    return '';
  }
  return dateString.split('T')[0];
};
