/**
 * 자산(비품) 관리 기능에서 사용되는 상수들을 정의합니다.
 */

// 자산 구분 (카테고리)
export const EQUIP_CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'NB', label: '노트북' },
  { value: 'MON', label: '모니터' },
  { value: 'PH', label: '전화기' },
  { value: 'ETC', label: '기타' }
];

// 자산 상태 (사용자용 - 폐기 제외)
export const EQUIP_STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'IN_USE', label: '사용중' }
];

// 사용자 실사 제출용 상태
export const USER_SURVEY_STATUS_OPTIONS = [
  { value: 'IN_USE', label: '사용중' },
  { value: 'NOT_IN_USE', label: '미보유' }
];

// 관리자 장비 관리용 상태 (폐기 포함)
export const ADMIN_EQUIP_STATUS_OPTIONS = [
  { value: 'IN_USE', label: '사용중' },
  { value: 'DISPOSED', label: '폐기' }
];

// 소유 구분
export const OWNERSHIP_TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '1', label: '회사' },
  { value: '2', label: '기타' }
];

// 실사 상태
export const SURVEY_STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'Y', label: '완료' },
  { value: 'N', label: '미완료' }
];
