/*
 * path           : src/shared/api/mock/mockData/menu.js
 * fileName       : menu
 * author         : changhyeon
 * date           : 25. 11. 12.
 * description    : 메뉴 관련 Mock 데이터
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 12.       changhyeon       초기 생성 (mockData.js 도메인 분리)
 */

/**
 * 계층 구조의 메뉴 트리 Mock 데이터
 * 3단계 깊이: 1차 카테고리 -> 2차 세부 카테고리 -> 3차 항목
 */
export const menus = [
  {
    menuId: 1,
    menuNm: '전자결재',
    menuDepth: '1',
    menuOrd: 1,
    children: [
      {
        menuId: 31,
        menuNm: '결재작성',
        uppMenuId: 1,
        menuDepth: '2',
        // 디비 연결안됨 이슈로 menuUrl 임시 설정 251119
        // menuUrl: '/groupware/aprv/myBox', //기존 menuUrl
        menuUrl: '/aprv/draft', // 임시 menuUrl
        menuOrd: 2,
        children: []
      },
      {
        menuId: 2,
        menuNm: '내 결재함',
        uppMenuId: 1,
        menuDepth: '2',
        menuUrl: '/aprv/myBox',
        menuOrd: 3,
        children: []
      },
      {
        menuId: 3,
        menuNm: '결재진행',
        uppMenuId: 1,
        menuDepth: '2',
        menuUrl: '/aprv/pendingBox',
        menuOrd: 4,
        children: []
      },
      {
        menuId: 4,
        menuNm: '결재현황',
        uppMenuId: 1,
        menuDepth: '2',
        menuUrl: '/aprv/status',
        menuOrd: 5,
        children: []
      }
    ]
  },
  {
    menuId: 11,
    menuNm: '내정보',
    menuDepth: '1',
    menuUrl: '/myInfo',
    menuOrd: 6,
    children: []
  },
  {
    menuId: 12,
    menuNm: '조직도 관리',
    menuDepth: '1',
    menuUrl: '/org',
    menuOrd: 7,
    children: []
  },
  {
    menuId: 13,
    menuNm: '직급 관리',
    menuDepth: '1',
    menuUrl: '/pos',
    menuOrd: 8,
    children: []
  },
  {
    menuId: 14,
    menuNm: '협력사 현황',
    menuDepth: '1',
    menuUrl: '/prt',
    menuOrd: 9,
    children: []
  },
  {
    menuId: 16,
    menuNm: '게시판',
    menuDepth: '1',
    menuOrd: 10,
    children: [
      {
        menuId: 17,
        menuNm: '사내 게시판',
        uppMenuId: 16,
        menuDepth: '2',
        menuUrl: '/archive/board',
        menuOrd: 11,
        children: []
      },
      {
        menuId: 18,
        menuNm: '공지사항',
        uppMenuId: 16,
        menuDepth: '2',
        menuUrl: '/archive/notice',
        menuOrd: 12,
        children: []
      },
      {
        menuId: 29,
        menuNm: '공지사항관리',
        uppMenuId: 16,
        menuDepth: '2',
        menuUrl: '/archive/notice/admin',
        menuOrd: 23,
        children: []
      }
    ]
  },
  {
    menuId: 19,
    menuNm: '문의 내역',
    menuDepth: '1',
    menuUrl: '/inquiry',
    menuOrd: 13,
    children: []
  },
  {
    menuId: 20,
    menuNm: '관리',
    menuDepth: '1',
    menuOrd: 14,
    children: [
      {
        menuId: 21,
        menuNm: '직원 관리',
        uppMenuId: 20,
        menuDepth: '2',
        menuUrl: '/sys/emp',
        menuOrd: 15,
        children: []
      },
      {
        menuId: 22,
        menuNm: '템플릿 관리',
        uppMenuId: 20,
        menuDepth: '2',
        menuUrl: '/sys/tmpl',
        menuOrd: 16,
        children: []
      },
      {
        menuId: 23,
        menuNm: '휴가일수 관리',
        uppMenuId: 20,
        menuDepth: '2',
        menuUrl: '/sys/vacCnt',
        menuOrd: 17,
        children: []
      }
    ]
  },
  {
    menuId: 24,
    menuNm: '문의하기',
    menuDepth: '1',
    menuUrl: '/inquiry/admin',
    menuOrd: 18,
    children: []
  },
  {
    menuId: 25,
    menuNm: '장비관리',
    menuDepth: '1',
    menuUrl: '/equips',
    menuOrd: 19,
    children: []
  },
  {
    menuId: 26,
    menuNm: '장비등록',
    menuDepth: '1',
    menuUrl: '/equips/survey',
    menuOrd: 20,
    children: []
  },
  {
    menuId: 27,
    menuNm: '장비관리(어드민)',
    menuDepth: '1',
    menuUrl: '/equips/admin',
    menuOrd: 21,
    children: []
  },
  {
    menuId: 28,
    menuNm: '장비등록(어드민)',
    menuDepth: '1',
    menuUrl: '/equips/survey/admin',
    menuOrd: 22,
    children: []
  },
  {
    menuId: 30,
    menuNm: '게시판(어드민)',
    menuDepth: '1',
    menuUrl: '/board/admin',
    menuOrd: 24,
    children: []
  },
  {
    menuId: 32,
    menuNm: '메뉴권한관리',
    menuDepth: '1',
    menuUrl: '/role',
    menuOrd: 25,
    children: []
  },
  {
    menuId: 33,
    menuNm: '임원업무관리',
    menuDepth: '1',
    menuOrd: 26,
    children: [
      {
        menuId: 34,
        menuNm: '내 프로젝트현황',
        uppMenuId: 33,
        menuDepth: '2',
        menuUrl: '/exec/work',
        menuOrd: 27,
        children: []
      },
      {
        menuId: 35,
        menuNm: '전체 프로젝트현황',
        uppMenuId: 33,
        menuDepth: '2',
        menuUrl: '/exec/work/all',
        menuOrd: 28,
        children: []
      }
    ]
  },
  {
    menuId: 5,
    menuNm: '예제',
    menuDepth: '1',
    menuUrl: '/example',
    menuOrd: 100,
    children: []
  },
  {
    menuId: 6,
    menuNm: '디자인페이지',
    menuDepth: '1',
    menuOrd: 101,
    children: [
      {
        menuId: 15,
        menuNm: 'layout00',
        uppMenuId: 6,
        menuDepth: '2',
        menuUrl: '/groupware/compoments/layout00',
        menuOrd: 102,
        children: []
      },
      {
        menuId: 7,
        menuNm: 'layout01',
        uppMenuId: 6,
        menuDepth: '2',
        menuUrl: '/groupware/compoments/layout01',
        menuOrd: 103,
        children: []
      },
      {
        menuId: 8,
        menuNm: 'layout02',
        uppMenuId: 6,
        menuDepth: '2',
        menuUrl: '/groupware/compoments/layout02',
        menuOrd: 104,
        children: []
      },
      {
        menuId: 9,
        menuNm: 'layout03',
        uppMenuId: 6,
        menuDepth: '2',
        menuUrl: '/groupware/compoments/layout03',
        menuOrd: 105,
        children: []
      }
    ]
  },
  {
    menuId: 10,
    menuNm: '대시보드',
    menuDepth: '1',
    menuUrl: '/dashboard',
    menuOrd: 110,
    children: []
  }
];
