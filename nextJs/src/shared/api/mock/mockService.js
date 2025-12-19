/*
 * path           : src/shared/api/mock/mockService.js
 * fileName       : mockService
 * author         : changhyeon
 * date           : 25. 11. 07.
 * description    : Mock API 라우팅 로직 (BYPASS_AUTH=true 개발 모드용)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 07.       changhyeon       최초 생성
 * 25. 11. 11.       changhyeon       Mock API 라우팅 구조화, ABAC 마이그레이션, 파일 헤더 추가
 * 25. 11. 12.       changhyeon       데이터/로직 분리 (mockData.js로 추출)
 */

import { LoggerFactory } from '@/shared/lib';

import { mockDatabase } from './mockData';

const logger = LoggerFactory.getLogger('MockData');

/**
 * Mock API 응답 생성 헬퍼
 */
const createMockResponse = (data, options = {}) => {
  return {
    data,
    status: options.status || 200,
    statusText: options.statusText || 'OK',
    headers: {},
    config: {}
  };
};

/**
 * Mock 데이터 API
 * API 엔드포인트별 Mock 응답 반환
 * 정확한 경로 매칭 핸들러 (METHOD + URL이 정확히 일치)
 *
 * 각 엔드포인트마다 핸들러 함수 정의
 * 새 엔드포인트 추가 시: exactRoutes 객체에 'METHOD /path' 키 추가
 */
export const exactRoutes = {
  // 인증 API
  'POST /api/auth/login': () => ({
    accessToken: `mock_access_token_${Date.now()}`,
    refreshToken: `mock_refresh_token_${Date.now()}`,
    user: {
      usrId: mockDatabase.user.usrId,
      usrNm: mockDatabase.user.usrNm,
      loginId: mockDatabase.user.loginId,
      tenantId: mockDatabase.user.tenantId,
      deptId: mockDatabase.user.deptId,
      deptNm: mockDatabase.user.deptNm
      // ABAC: permissions 필드 제거 (이제 각 API에서 제공)
    },
    expiresIn: 3600
  }),
  'GET /api/auth/me': () => ({
    usrId: mockDatabase.user.usrId,
    usrNm: mockDatabase.user.usrNm,
    loginId: mockDatabase.user.loginId,
    tenantId: mockDatabase.user.tenantId,
    deptId: mockDatabase.user.deptId,
    deptNm: mockDatabase.user.deptNm
  }),
  'POST /api/auth/logout': () => ({ success: true }),
  'POST /api/auth/refresh': () => ({
    accessToken: `mock_access_token_${Date.now()}`,
    refreshToken: `mock_refresh_token_${Date.now()}`,
    expiresIn: 3600
  }),

  // 메뉴 API
  'GET /api/menus/accessible': () => mockDatabase.menus,

  // 회사 정보 API
  'GET /api/v1/company/info': () => mockDatabase.companyInfo,
  'PUT /api/v1/company/info': () => ({
    success: true,
    message: '회사 정보가 수정되었습니다.'
  }),

  // 결재 API (ABAC: 각 목록에 metadata.permissions 추가)
  'GET /api/v1/aprv/draft/getTemplate': () => mockDatabase.aprvTemplates,
  'GET /api/v1/aprv/draft/getAprvStep': () => mockDatabase.aprvLines,

  // 내 결재함 (작성한 문서 목록)
  'GET /api/v1/aprv/box/getMyBoxList': () => ({
    data: mockDatabase.myBoxDrafts,
    totalCount: mockDatabase.myBoxDrafts.length,
    page: 1,
    size: 10,
    metadata: {
      permissions: ['create'] // 목록 페이지에서 할 수 있는 행동
    }
  }),

  // 결재진행함 (결재 대기 문서 목록)
  'GET /api/v1/aprv/box/getPendingBoxList': () => ({
    data: mockDatabase.pendingBoxDrafts,
    totalCount: mockDatabase.pendingBoxDrafts.length,
    page: 1,
    size: 10,
    metadata: {
      permissions: ['approve', 'reject', 'comment'] // 결재 권한
    }
  }),

  // 결재현황
  'GET /api/v1/aprv/status/getList': () => ({
    data: mockDatabase.statusDrafts,
    totalCount: mockDatabase.statusDrafts.length,
    page: 1,
    size: 10,
    metadata: {
      permissions: ['view'] // 조회만 가능
    }
  }),

  // 게시판 목록 (ABAC: metadata.permissions 추가)
  'GET /api/boards': () => {
    const { boards } = mockDatabase;
    const totalCount = boards.length;
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      list: boards,
      totalCount,
      page: 1,
      size: pageSize,
      totalPages,
      metadata: {
        permissions: ['create', 'write'] // 목록 페이지에서 게시글 작성 가능
      }
    };
  },

  // 예제 게시판 목록 (ABAC: metadata.permissions 추가)
  'GET /api/sample/boards': () => {
    const { boards } = mockDatabase;
    const totalCount = boards.length;
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      list: boards,
      totalCount,
      page: 1,
      size: pageSize,
      totalPages,
      metadata: {
        permissions: ['create', 'write'] // 목록 페이지에서 게시글 작성 가능
      }
    };
  }
};

/**
 * 정규식 경로 매칭 핸들러
 *
 * 순서대로 실행되므로, 구체적인 패턴부터 정의할 것
 * 각 핸들러는 정규식의 match 객체를 받음 (ID 파라미터 추출 시 사용)
 */
const patternRoutes = [
  // 테넌트 API (경로 시작 매칭: /api/tenants/xxx)
  {
    pattern: /^\/api\/tenants\//,
    handler: () => mockDatabase.tenant
  },

  // 게시판 상세 API
  {
    pattern: /^\/api\/boards\/[0-9]+$/,
    handler: (match) => {
      const boardId = parseInt(match[1]);
      const board = mockDatabase.boards.find((b) => b.smpId === boardId);
      if (!board) {
        return {};
      }
      return {
        ...board,
        metadata: { permissions: ['edit', 'delete', 'comment'] }
      };
    }
  },

  // 예제 게시판 상세 API
  {
    pattern: /^\/api\/sample\/boards\/[0-9]+$/,
    handler: (match) => {
      const boardId = parseInt(match[1]);
      const board = mockDatabase.boards.find((b) => b.smpId === boardId);
      if (!board) {
        return {};
      }
      return {
        ...board,
        metadata: { permissions: ['edit', 'delete', 'comment'] }
      };
    }
  }

  // 새로운 패턴 추가 예시 (필요시):
  // {
  //   pattern: /^\/api\/users\/(\d+)$/,
  //   handler: (match) => {
  //     const userId = parseInt(match[1]);
  //     return mockDatabase.users?.find(u => u.id === userId) || {};
  //   }
  // }
];

/**
 * Mock API 응답 라우터
 *
 * 라우팅 순서:
 * 1. 정확한 경로 매칭 (exactRoutes)
 * 2. 패턴 매칭 (patternRoutes)
 * 3. 404 응답
 */
export const getMockResponse = (method, url) => {
  logger.debug(`[Mock] ${method} ${url}`);

  const routeKey = `${method} ${url}`;

  // 1. 정확한 매칭 시도
  if (exactRoutes[routeKey]) {
    return createMockResponse(exactRoutes[routeKey]());
  }

  // 2. 패턴 매칭 시도 (순서대로)
  for (const route of patternRoutes) {
    const match = url.match(route.pattern);
    if (match) {
      return createMockResponse(route.handler(match, method, url));
    }
  }

  // 3. 라우팅 불가 (404)
  logger.warn(`[Mock] No mock data defined for ${method} ${url}`);
  return createMockResponse({ message: 'Mock data not defined', url }, { status: 404, statusText: 'Not Found' });
};

/**
 * 테넌트 정보 가져오기 (동기)
 */
export const getMockTenant = () => {
  return mockDatabase.tenant;
};

/**
 * 현재 사용자 정보 가져오기 (동기)
 */
export const getMockUser = () => {
  return mockDatabase.user;
};

/**
 * Mock 데이터 내보내기 (테스트용)
 */
export const mockData = mockDatabase;
