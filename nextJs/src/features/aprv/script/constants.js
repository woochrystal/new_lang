export const APRV_CONSTANTS = {
  // 페이지 설정
  DEFAULT_PAGE_SIZE: 10,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 10000,
  MAX_FILES: 5,

  // 페이지네이션 초기값
  INITIAL_PAGINATION: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0
  },

  // 결재 상태 (백엔드 코드와 동기화)
  STATUS: {
    COMPLETED: 'CMPL', // 완료 (결재라인에서 상신/승인 처리 시)
    REQUESTED: 'REQ', // 결재상신(기안)
    TEMPORARY: 'TEMP', // 임시저장
    REJECTED: 'RJCT', // 반려
    WITHDRAWN: 'WTHD', // 회수
    DELETE: 'DEL' // 삭제
  },

  // 결재 상태 한글명
  STATUS_LABEL: {
    CMPL: '완료',
    REQ: '진행중',
    TEMP: '임시저장',
    RJCT: '반려',
    WTHD: '회수',
    DEL: '삭제'
  },

  // 결재 유형 (백엔드 코드와 동기화)
  APPROVAL_TYPE: {
    GENERAL: 'GENE', // 일반
    VACATION: 'VCT', // 휴가
    EXPENSE: 'EXPN' // 비용
  },

  // 결재 유형 한글명
  APPROVAL_TYPE_LABEL: {
    GENE: '일반',
    VCT: '휴가',
    EXPN: '비용'
  },

  // 검색 조건 옵션
  SEARCH_TYPE_OPTIONS: [
    { value: 'all', label: '전체' },
    { value: 'title', label: '제목' },
    { value: 'content', label: '내용' },
    { value: 'docNo', label: '문서번호' }
  ],

  // 내결재함 결재상태 검색 옵션
  APPROVAL_MYBOX_STS_OPTIONS: [
    { value: 'all', label: '전체' },
    { value: 'REQ', label: '진행중' },
    { value: 'CMPL', label: '완료' },
    { value: 'RJCT', label: '반려' },
    { value: 'WTHD', label: '회수' },
    { value: 'TEMP', label: '임시저장' }
  ],

  // 결재대기 / 각 결재현황 결재상태 검색 옵션
  APPROVAL_PENDING_STS_OPTIONS: [
    { value: 'all', label: '전체' },
    { value: 'REQ', label: '진행중' },
    { value: 'CMPL', label: '완료' },
    { value: 'RJCT', label: '반려' }
  ],

  // 결재 유형 검색 옵션
  APPROVAL_TYPE_OPTIONS: [
    { value: 'all', label: '전체' },
    { value: 'GENE', label: '일반' },
    { value: 'VCT', label: '휴가' },
    { value: 'EXPN', label: '비용' }
  ],

  // 결재상신 - 휴가종류
  VACATION_TYPE_OPTIONS: [
    { value: '-', label: '선택' },
    { value: 'DAY', label: '연차' },
    { value: 'HALF', label: '반차' },
    { value: 'SICK', label: '병가' },
    { value: 'EVT', label: '경조사' },
    { value: 'OTHER', label: '기타' }
  ],

  // 결재상신 - 결재수단 종류
  EXPENSE_TYPE_OPTIONS: [
    { value: '-', label: '선택' },
    { value: 'PERSO', label: '카드(개인)' },
    { value: 'CORPO', label: '카드(법인)' },
    { value: 'CASH', label: '현금' }
  ],

  // 내 결재함 테이블 컬럼 정의
  APRV_MYBOX_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'aprvTyNm', label: '결재 유형' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'draftDt', label: '기안일시' }
  ],

  // 결재대기 테이블 컬럼 정의
  APRV_PENDING_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'aprvTyNm', label: '결재 유형' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'draftUsrNm', label: '기안자' },
    { key: 'draftDeptNm', label: '기안 부서' },
    { key: 'draftDt', label: '기안일시' }
  ],

  // 업무관리 휴가 table 컬럼 정의
  TASK_VAC_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'vacTyNm', label: '휴가 종류' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'draftDt', label: '기안일' },
    { key: 'vacStaDt', label: '시작일' },
    { key: 'vacEndDt', label: '종료일' },
    { key: 'vacDays', label: '사용일수' },
    { key: 'vacRsn', label: '휴가사유' }
  ],

  // 업무관리 비용 table 컬럼 정의
  TASK_EXPN_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'draftDt', label: '기안일' },
    { key: 'expnDt', label: '사용일' },
    { key: 'expnTyNm', label: '결재 수단' },
    { key: 'payAmt', label: '금액' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'stlDt', label: '정산일' },
    { key: 'expnRsn', label: '지출사유' }
  ],

  // 업무관리 비용 검색 - 결재수단 종류
  EXPENSE_TYPE_SEARCH_OPTIONS: [
    { value: 'all', label: '전체' },
    { value: 'PERSO', label: '카드(개인)' },
    { value: 'CORPO', label: '카드(법인)' },
    { value: 'CASH', label: '현금' }
  ],

  // 임원업무관리 휴가결재현황 table 컬럼 정의
  EXEC_VAC_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'draftUsrNm', label: '기안자' },
    { key: 'draftDeptNm', label: '기안 부서' },
    { key: 'draftDt', label: '기안일시' },
    { key: 'vacTyNm', label: '휴가 종류' },
    { key: 'vacStaDt', label: '시작일' },
    { key: 'vacEndDt', label: '종료일' }
  ],

  // 임원업무현황 비용결재현황 table 컬럼 정의
  EXEC_EXPN_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'draftUsrNm', label: '기안자' },
    { key: 'draftDeptNm', label: '기안 부서' },
    { key: 'draftDt', label: '기안일시' },
    { key: 'payAmt', label: '금액' },
    { key: 'stlDt', label: '정산일' },
    { key: 'expnRsn', label: '지출사유' }
  ],

  // 임원업무현황 일반결재현황 table 컬럼 정의
  EXEC_GENERAL_COLUMN: [
    { key: 'docNo', label: '문서번호' },
    { key: 'aprvSt', label: '결재 상태' },
    { key: 'draftUsrNm', label: '기안자' },
    { key: 'draftDeptNm', label: '기안 부서' },
    { key: 'draftDt', label: '기안일시' },
    { key: 'aprvTitle', label: '제목' }
  ],

  // 임원업무현황 일반결재 검색구분 옵션
  EXEC_GENERAL_SEARCH_TYPE_OPTIONS: [
    { value: 'draftUsrNm', label: '기안자' },
    { value: 'title', label: '결재 제목' }
  ]
};
