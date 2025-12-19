export const EMP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  WORK_STATUS: {
    APPROVED: '승인',
    REJECTED: '반려',
    PENDING: '미결'
  },
  ROLES: {
    ADMIN: '관리자',
    MANAGER: '매니저',
    MEMBER: '일반'
  },
  // 회원권한 코드 (데이터베이스 저장용)
  ROLE_CODES: {
    USER: 'USER', // 회원
    SYSADM: 'SYSADM', // 시스템관리자
    ADM: 'ADM' // 관리자
  },
  // 회원권한 라디오 버튼 옵션 (한글 라벨, 영문 value)
  ROLE_OPTIONS: [
    { value: 'USER', label: '회원' },
    { value: 'SYSADM', label: '시스템관리자' },
    { value: 'ADM', label: '관리자' }
  ],
  // 회원구분 (재직상태)
  MEMBER_TYPE: {
    ACTIVE: '재직',
    RESIGNED: '퇴사'
  },
  // 검색 타입 옵션
  SEARCH_TYPE_OPTIONS: [
    { value: '', label: '선택' },
    { value: 'empStatus', label: '회원구분' }
  ],
  // 회원구분 옵션
  MEMBER_TYPE_OPTIONS: [
    { value: '', label: '전체' },
    { value: '재직', label: '재직' },
    { value: '퇴사', label: '퇴사' }
  ],
  // 계약구분 (EMP_TY)
  EMP_TYPE: {
    FULL: '정직원',
    CONT: '계약직',
    PART: '협력사'
  },
  // 계약구분 옵션
  EMP_TYPE_OPTIONS: [
    { value: '', label: '전체' },
    { value: 'FULL', label: '정직원' },
    { value: 'CONT', label: '계약직' },
    { value: 'PART', label: '협력사' }
  ]
};
