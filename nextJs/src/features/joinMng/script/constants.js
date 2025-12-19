export const JOINMNG_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PTNR_NM_LENGTH: 50,
  MAX_CEO_NM_LENGTH: 50,
  MAX_MAIN_SVC_LENGTH: 100,
  MAX_MAIN_MGR_LENGTH: 30,
  MAX_MGR_TEL_LENGTH: 20,
  MAX_NOTE_LENGTH: 500,

  // 가입신청관리 승인상태 검색 옵션
  APPROVAL_STS_OPTIONS: [
    { value: '', label: '전체' },
    { value: 'PENDING', label: '대기' },
    { value: 'APPROVED', label: '승인' },
    { value: 'DENIED', label: '반려' }
  ]
};
