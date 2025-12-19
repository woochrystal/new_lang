/*
 * path           : src/shared/auth/authApi.js
 * fileName       : authApi
 * author         : changhyeon
 * date           : 25. 09. 12.
 * description    : 로그인/토큰/메뉴/테넌트 API 서비스
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 09. 12.       changhyeon       최초 생성
 * 25. 09. 12.       changhyeon       에러 메시지 처리 및 로그인, 권한관리 기능 추가
 * 25. 10. 14.       changhyeon       프론트엔드 백엔드 연동 샘플
 * 25. 10. 22.       changhyeon       로그인 및 인증 401오류 발생시 오류처리 개선
 * 25. 10. 24.       changhyeon       api 클라이언트 사용시 try-catch를 사용하지 않도록 수정
 * 25. 10. 24.       changhyeon       토큰 갱신 실패시 로그인페이지 리다이렉션 수정
 * 25. 11. 03.       changhyeon       권한 및 사용자정보 오버라이딩 이슈 해결
 */

import { apiClient } from '@/shared/api';
import { LoggerFactory, isMultiTenantMode } from '@/shared/lib';
import { useTenantStore, useAuthStore } from '@/shared/store';

const logger = LoggerFactory.getLogger('AuthenticationAPI');

/**
 * 통합 API 서비스
 */
export const authApi = {
  // ====================================================================
  // Auth APIs
  // ====================================================================

  /**
   * 로그인
   */
  login: async (credentials) => {
    // 환경 기반 테넌트 ID 설정
    let domainPath;
    if (isMultiTenantMode()) {
      // 멀티 테넌트 모드: tenantPath를 domainPath로 사용
      domainPath = useTenantStore.getState().tenantPath;
      if (!domainPath) {
        return {
          data: null,
          error: {
            message: '멀티 테넌트 모드에서 테넌트 경로를 찾을 수 없습니다.',
            status: 400
          }
        };
      }
    } else {
      domainPath = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || 'pentas'; // 환경 변수에서 가져오거나 기본값 사용
    }

    const body = {
      ...credentials,
      domainPath,
      tenantId: null
    };

    return await apiClient.post('/api/auth/login', body, {
      headers: {
        'X-Skip-Auth-Redirect': 'true'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('Login failed:', error);
        return null;
      },
      _finally: () => {
        useAuthStore.setState((state) => {
          state.isLoading = false;
        });
      }
    });
  },

  /**
   * 로그아웃
   */
  logout: async (refreshToken, options = {}) => {
    const {
      _onError: callerOnError = () => {
        /* no-op */
      }
    } = options;
    return await apiClient.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          ...(refreshToken && { 'X-Refresh-Token': refreshToken })
        },
        _onSuccess: () => null,
        _onError: (error) => {
          callerOnError(error); // 호출자의 _onError 먼저 실행
          return null; // 전역 에러 처리는 여전히 막음
        }
      }
    );
  },

  /**
   * 토큰 갱신
   */
  refresh: async (refreshToken) => {
    const response = await apiClient.post(
      '/api/auth/refresh',
      {},
      {
        skipAuthRefresh: true, // 무한 루프 방지
        headers: {
          ...(refreshToken && { 'X-Refresh-Token': refreshToken })
        },
        _onSuccess: (response) => response.data
      }
    );

    if (response.error) {
      throw response.error;
    }

    return response.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (options = {}) => {
    return await apiClient.get('/api/auth/me', {
      skipAuthRefresh: options.skipAuthRefresh,
      _onSuccess: (response) => response.data
    });
  },

  // ====================================================================
  // Menu APIs
  // ====================================================================

  /**
   * 메뉴 트리 조회
   */
  async getMenuTree() {
    return await apiClient.get('/api/menus/accessible', {
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('메뉴 조회 실패: {}', error.message);
        return null;
      }
    });
  },

  // ====================================================================
  // Tenant APIs
  // ====================================================================

  /**
   * 테넌트 정보 조회
   */
  async getTenantInfo(tenantId) {
    return await apiClient.get(`/api/tenants/${tenantId}`, {
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('테넌트 정보 조회 실패: {}', error.message);
        return null;
      },
      headers: {
        'X-Skip-Auth-Redirect': 'true' // 리다이렉트 스킵
      }
    });
  }
};
