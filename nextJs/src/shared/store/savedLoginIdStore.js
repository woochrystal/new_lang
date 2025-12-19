/*
 * path           : src/shared/store/savedLoginIdStore
 * fileName       : savedLoginIdStore.js
 * author         : Park ChangHyeon
 * date           : 25. 12. 18.
 * description    : 테넌트별 저장된 로그인 아이디 관리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 12. 18.       Park ChangHyeon        최초 생성
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('SavedLoginIdStore');

/**
 * 테넌트별 저장된 로그인 아이디 관리
 *
 * localStorage에 테넌트별로 아이디를 저장하여
 * 다음 로그인 시 자동으로 아이디를 채울 수 있게 합니다.
 *
 * 저장 구조:
 * {
 *   loginId: {
 *     'acme': 'user1',
 *     'pentas': 'user2',
 *     'company-xyz': 'admin'
 *   }
 * }
 */
export const useSavedLoginIdStore = create(
  persist(
    (set, get) => ({
      // 상태: 테넌트별 저장된 아이디 맵
      loginId: {},

      /**
       * 특정 테넌트의 저장된 아이디 조회
       * @param {string} tenantId - 테넌트 ID
       * @returns {string | null} 저장된 아이디 또는 null
       */
      getSavedLoginId: (tenantId) => {
        if (!tenantId) {
          return null;
        }
        return get().loginId[tenantId] || null;
      },

      /**
       * 특정 테넌트의 아이디 저장
       * @param {string} tenantId - 테넌트 ID
       * @param {string} loginId - 저장할 아이디
       */
      setSavedLoginId: (tenantId, loginId) => {
        if (!tenantId || !loginId) {
          logger.warn('[SavedLoginIdStore] tenantId 또는 loginId가 없습니다.');
          return;
        }

        set((state) => ({
          loginId: {
            ...state.loginId,
            [tenantId]: loginId
          }
        }));
      },

      /**
       * 특정 테넌트의 저장된 아이디 삭제
       * @param {string} tenantId - 테넌트 ID
       */
      removeSavedLoginId: (tenantId) => {
        if (!tenantId) {
          return;
        }

        set((state) => {
          const newLoginId = { ...state.loginId };
          delete newLoginId[tenantId];
          return { loginId: newLoginId };
        });
      },

      /**
       * 모든 저장된 아이디 삭제
       */
      clearAllSavedIds: () => {
        set({ loginId: {} });
      }
    }),
    {
      name: 'pentaware-saved-login-id',
      storage: createJSONStorage(() => localStorage),
      onError: (error) => {
        logger.error('[SavedLoginIdStore] persist error:', error);
      }
    }
  )
);
