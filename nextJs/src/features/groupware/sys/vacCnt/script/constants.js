/**
 * @fileoverview VacCnt 관련 상수 정의
 * @description 휴가일수관리 기능에서 사용하는 상수들
 */

/**
 * 휴가일수관리 상수
 */
export const VACCNT_CONSTANTS = {
  // 페이지네이션
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,

  // 재직상태 (EMP_STATUS) - 계산된 값
  EMP_STATUS: {
    ACTIVE: '재직',
    UPCOMING: '입사예정',
    RESIGNED: '퇴사'
  },

  // 계약구분 (EMP_TY) - 데이터베이스 코드
  EMP_TYPE: {
    FULL: '정직원',
    CONT: '계약직',
    PART: '협력사'
  },

  // 계약구분 옵션 (Select/Radio 컴포넌트용)
  EMP_TYPE_OPTIONS: [
    { value: '', label: '전체' },
    { value: 'FULL', label: '정직원' },
    { value: 'CONT', label: '계약직' },
    { value: 'PART', label: '협력사' }
  ],

  // 기준 년도
  CURRENT_YEAR: new Date().getFullYear(),
  YEAR_RANGE_PAST: 5, // 현재 년도 기준 과거 5년
  YEAR_RANGE_FUTURE: 1, // 현재 년도 기준 미래 1년

  // 검색 필터
  SEARCH_FIELDS: {
    YEAR: 'year',
    EMP_NAME: 'empName'
  },

  // 정렬
  SORT_FIELDS: {
    YEAR: 'year',
    EMP_NAME: 'empName',
    TOTAL_DAYS: 'totalVacationDays',
    USED_DAYS: 'usedVacationDays'
  },

  SORT_ORDERS: {
    ASC: 'asc',
    DESC: 'desc'
  },

  // 유효성 검증
  VALIDATION: {
    MIN_VACATION_DAYS: 0,
    MAX_VACATION_DAYS: 999,
    MAX_DECIMAL_PLACES: 1
  },

  // 테이블 컬럼 키
  TABLE_COLUMNS: {
    ROW_NUMBER: 'rowNumber',
    EMP_NAME: 'empName',
    YEAR: 'year',
    USED_DAYS: 'usedVacationDays',
    TOTAL_DAYS: 'totalVacationDays'
  }
};

/**
 * 년도 옵션 생성 (현재 년도 기준 과거 5년, 미래 1년)
 * @returns {Array<{value: number, label: string}>}
 */
export const getYearOptions = () => {
  const currentYear = VACCNT_CONSTANTS.CURRENT_YEAR;
  const pastRange = VACCNT_CONSTANTS.YEAR_RANGE_PAST;
  const futureRange = VACCNT_CONSTANTS.YEAR_RANGE_FUTURE;
  const years = [];

  for (let i = currentYear + futureRange; i >= currentYear - pastRange; i--) {
    years.push({
      value: i,
      label: `${i}`
    });
  }

  return years;
};
