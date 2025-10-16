import { BOARD_CONSTANTS } from './constants';

/**
 * 날짜 문자열을 사용자 친화적인 상대 시간 또는 날짜 형식으로 변환합니다.
 * (예: "방금 전", "5분 전", "3시간 전", "2일 전", "2023. 10. 27.")
 * @param {string | undefined | null} dateString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 변환된 날짜 문자열 또는 변환 실패 시 원래 문자열
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

/**
 * 게시판 목록 조회에 사용될 기본 검색 파라미터 객체를 생성합니다.
 * @param {Partial<{page: number, size: number, searchKeyword: string}>} [overrides={}] - 기본값을 덮어쓸 속성 객체
 * @returns {{page: number, size: number, searchKeyword: string}} 기본 검색 파라미터 객체
 */
export const createDefaultSearchParams = (overrides = {}) => {
  return {
    page: 1,
    size: BOARD_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchKeyword: '',
    ...overrides
  };
};
