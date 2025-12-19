/**
 * @fileoverview 프로젝트현황 관련 상수 정의
 * @description 페이지 크기, 테이블 컬럼 등 상수
 */

/**
 * 프로젝트현황 관련 상수
 */
export const WORK_CONSTANTS = {
  /**
   * 기본 페이지 크기
   */
  DEFAULT_PAGE_SIZE: 10,

  /**
   * 테이블 컬럼 정의
   */
  COLUMNS: [
    { key: 'rowNumber', label: '번호', width: '80px' },
    { key: 'client', label: '고객사', width: '150px' },
    { key: 'projectName', label: '프로젝트명' },
    { key: 'status', label: '진행상태', width: '120px' },
    { key: 'startDate', label: '투입일', width: '120px' },
    { key: 'endDate', label: '철수일', width: '120px' },
    { key: 'location', label: '장소', width: '200px' }
  ],

  /**
   * 프로젝트 상태 옵션
   */
  STATUS_OPTIONS: [
    { value: '', label: '전체' },
    { value: '영업단계', label: '영업단계' },
    { value: '수행단계', label: '수행단계' },
    { value: '종단단계', label: '종단단계' },
    { value: '미수행', label: '미수행' }
  ],

  /**
   * 검색 타입 옵션
   */
  SEARCH_TYPE_OPTIONS: [
    { value: '', label: '선택' },
    { value: 'prjNm', label: '프로젝트명' },
    { value: 'prjClient', label: '고객사' },
    { value: 'status', label: '진행상태' },
    { value: 'empNm', label: '직원명' }
  ]
};
