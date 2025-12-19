/**
 * @fileoverview Board 관련 유틸리티 함수
 */

/**
 * 날짜 문자열을 상대 시간 또는 날짜 형식으로 변환합니다.
 * @param {string | undefined | null} dateString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 변환된 날짜 문자열 또는 원래 문자열
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return '-';
  }

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return '방금 전';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    return date.toLocaleDateString('ko-KR');
  } catch {
    return dateString;
  }
};
