/*
 * path           : src/shared/api/mock/mockData/approval.js
 * fileName       : approval
 * author         : changhyeon
 * date           : 25. 11. 12.
 * description    : 전자결재 관련 Mock 데이터 (템플릿, 문서, 결재선)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 12.       changhyeon       초기 생성 (mockData.js 도메인 분리)
 */

/**
 * 결재 템플릿 목록
 */
export const aprvTemplates = [
  {
    templId: 1,
    templNm: '일반결재',
    templDsc: '일반 업무 승인용 템플릿',
    templCt: '<div>일반결재 템플릿 내용</div>'
  },
  {
    templId: 2,
    templNm: '휴가신청',
    templDsc: '휴가 승인용 템플릿',
    templCt: '<div>휴가신청 템플릿 내용</div>'
  },
  {
    templId: 3,
    templNm: '경비청구',
    templDsc: '경비 승인용 템플릿',
    templCt: '<div>경비청구 템플릿 내용</div>'
  }
];

/**
 * 내 결재함 (사용자가 작성한 문서)
 */
export const myBoxDrafts = [
  {
    aprvId: 1,
    aprvNo: 'APR-2024-001',
    aprvTl: '마케팅 예산 승인 요청',
    aprvTy: 'GENE',
    aprvSt: 'REQ',
    reqDt: '2024-11-01',
    reqUsrNm: '김개발',
    aprvCts: '<div>마케팅 예산 관련 내용</div>',
    aprvCmnt: null,
    aprvDt: null,
    aprvRsltCd: null
  },
  {
    aprvId: 2,
    aprvNo: 'APR-2024-002',
    aprvTl: '회의실 예약 승인',
    aprvTy: 'GENE',
    aprvSt: 'CMPL',
    reqDt: '2024-10-28',
    reqUsrNm: '김개발',
    aprvCts: '<div>회의실 예약 관련 내용</div>',
    aprvCmnt: '승인합니다.',
    aprvDt: '2024-10-29',
    aprvRsltCd: 'APPR'
  },
  {
    aprvId: 3,
    aprvNo: 'APR-2024-003',
    aprvTl: '이월예산 편성',
    aprvTy: 'GENE',
    aprvSt: 'RJCT',
    reqDt: '2024-10-25',
    reqUsrNm: '김개발',
    aprvCts: '<div>이월예산 관련 내용</div>',
    aprvCmnt: '수정 후 재제출 바랍니다.',
    aprvDt: '2024-10-26',
    aprvRsltCd: 'RJCT'
  }
];

/**
 * 결재진행함 (사용자의 결재 대기 문서)
 */
export const pendingBoxDrafts = [
  {
    aprvId: 101,
    aprvNo: 'APR-2024-101',
    aprvTl: '신규 프로젝트 제안',
    aprvTy: 'GENE',
    aprvSt: 'REQ',
    reqDt: '2024-11-05',
    reqUsrNm: '이차장',
    aprvCts: '<div>신규 프로젝트 제안 내용</div>',
    aprvCmnt: null,
    aprvDt: null,
    aprvRsltCd: null,
    aprvStep: 1,
    currAprvUsrNm: '개발자'
  },
  {
    aprvId: 102,
    aprvNo: 'APR-2024-102',
    aprvTl: '출장비 지출 승인',
    aprvTy: 'EXPN',
    aprvSt: 'REQ',
    reqDt: '2024-11-04',
    reqUsrNm: '박팀장',
    aprvCts: '<div>출장비 지출 내용</div>',
    aprvCmnt: null,
    aprvDt: null,
    aprvRsltCd: null,
    aprvStep: 1,
    currAprvUsrNm: '개발자'
  }
];

/**
 * 결재 현황 (조회만 가능)
 */
export const statusDrafts = [
  {
    aprvId: 1,
    aprvNo: 'APR-2024-001',
    aprvTl: '마케팅 예산 승인 요청',
    aprvTy: 'GENE',
    aprvSt: 'REQ',
    reqDt: '2024-11-01',
    reqUsrNm: '김개발',
    aprvSteps: [
      {
        order: 1,
        aprvUsrNm: '개발자',
        aprvRsltCd: 'PEND',
        aprvDt: null
      },
      {
        order: 2,
        aprvUsrNm: '박팀장',
        aprvRsltCd: 'PEND',
        aprvDt: null
      }
    ]
  },
  {
    aprvId: 2,
    aprvNo: 'APR-2024-002',
    aprvTl: '회의실 예약 승인',
    aprvTy: 'GENE',
    aprvSt: 'CMPL',
    reqDt: '2024-10-28',
    reqUsrNm: '김개발',
    aprvSteps: [
      {
        order: 1,
        aprvUsrNm: '개발자',
        aprvRsltCd: 'APPR',
        aprvDt: '2024-10-29'
      }
    ]
  }
];

/**
 * 결재선 (결재 라우팅)
 */
export const aprvLines = [
  {
    order: 1,
    usrId: 999,
    usrNm: '개발자',
    deptNm: '개발팀',
    usrRole: 'ADMIN'
  },
  {
    order: 2,
    usrId: 1001,
    usrNm: '박팀장',
    deptNm: '영업팀',
    usrRole: 'TEAM_LEAD'
  },
  {
    order: 3,
    usrId: 1002,
    usrNm: '이부장',
    deptNm: '경영팀',
    usrRole: 'MANAGER'
  }
];
