/*
 * path           : src/shared/api/mock/mockData/board.js
 * fileName       : board
 * author         : changhyeon
 * date           : 25. 11. 12.
 * description    : 게시판 관련 Mock 데이터
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 12.       changhyeon       초기 생성 (mockData.js 도메인 분리)
 */

/**
 * 게시판 목록
 */
export const boards = [
  {
    smpId: 1,
    title: '회의실 사용 안내',
    content: '<div>회의실 사용에 대한 안내 사항입니다.</div>',
    regId: '관리자',
    regDtm: '2024-11-01T09:00:00Z',
    updDtm: '2024-11-01T09:00:00Z',
    delYn: 'N',
    fileId: 1
  },
  {
    smpId: 2,
    title: '시스템 점검 안내',
    content: '<div>11월 5일 23:00~05:00 시스템 점검이 있습니다.</div>',
    regId: '시스템관리자',
    regDtm: '2024-10-28T14:30:00Z',
    updDtm: '2024-10-28T14:30:00Z',
    delYn: 'N',
    fileId: null
  },
  {
    smpId: 3,
    title: '11월 사원 워크숍 안내',
    content: '<div>11월 15일 전사 워크숍이 개최됩니다. 참석 바랍니다.</div>',
    regId: '인사팀',
    regDtm: '2024-10-25T10:15:00Z',
    updDtm: '2024-10-25T10:15:00Z',
    delYn: 'N',
    fileId: 2
  }
];
