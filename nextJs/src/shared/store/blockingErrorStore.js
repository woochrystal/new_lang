/*
 * path           : src/shared/store/blockingErrorStore.js
 * fileName       : blockingErrorStore
 * author         : changhyeon
 * date           : 25. 11. 19.
 * description    : 전체 화면 차단 에러 상태 관리 (네트워크, 인증, 서버 오류 등)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 19.       changhyeon       최초 생성
 */

import { create } from 'zustand';

/**
 * @typedef {Object} BlockingError
 * @property {'network'|'auth'|'server'|'maintenance'} type - 에러 타입
 * @property {string} title - 에러 제목
 * @property {string} message - 에러 메시지
 * @property {Function} onRetry - 재시도 콜백 (필수)
 * @property {string} retryText - 재시도 버튼 텍스트
 */

/**
 * 전체 화면을 차단하는 에러 상태 관리 Store
 *
 * 앱 진입 불가 상황에서 사용:
 * - 초기 프로필 로드 실패 (네트워크 오류)
 * - 인증 실패
 * - 서버 에러
 * - 유지보수 중
 *
 * 사용법:
 * ```javascript
 * const { showNetworkError, hide } = useBlockingErrorStore();
 *
 * // 네트워크 오류
 * showNetworkError(
 *   '서버에 연결할 수 없습니다.',
 *   () => { retryLogic(); }
 * );
 *
 * // 닫기
 * hide();
 * ```
 *
 * @returns {Object} 에러 관리 메서드
 * @returns {BlockingError|null} blockingError - 현재 블로킹 에러 (없으면 null)
 * @returns {Function} showNetworkError - 네트워크 오류 표시
 * @returns {Function} showAuthError - 인증 오류 표시
 * @returns {Function} showServerError - 서버 오류 표시
 * @returns {Function} showMaintenanceError - 유지보수 중 표시
 * @returns {Function} hide - 블로킹 에러 숨기기
 */
export const useBlockingErrorStore = create((set) => ({
  blockingError: null,

  /**
   * 네트워크 오류 표시
   * @param {string} message - 에러 메시지
   * @param {Function} onRetry - 재시도 콜백
   * @param {string} [retryText='다시 시도'] - 버튼 텍스트
   */
  showNetworkError(message, onRetry, retryText = '다시 시도') {
    set({
      blockingError: {
        type: 'network',
        title: '네트워크 오류',
        message,
        onRetry,
        retryText
      }
    });
  },

  /**
   * 인증 오류 표시
   * @param {string} message - 에러 메시지
   * @param {Function} onRetry - 재시도 콜백
   * @param {string} [retryText='다시 시도'] - 버튼 텍스트
   */
  showAuthError(message, onRetry, retryText = '다시 시도') {
    set({
      blockingError: {
        type: 'auth',
        title: '인증 오류',
        message,
        onRetry,
        retryText
      }
    });
  },

  /**
   * 서버 오류 표시
   * @param {string} message - 에러 메시지
   * @param {Function} onRetry - 재시도 콜백
   * @param {string} [retryText='다시 시도'] - 버튼 텍스트
   */
  showServerError(message, onRetry, retryText = '다시 시도') {
    set({
      blockingError: {
        type: 'server',
        title: '서버 오류',
        message,
        onRetry,
        retryText
      }
    });
  },

  /**
   * 유지보수 중 표시
   * @param {string} [message] - 에러 메시지
   * @param {Function} [onRetry] - 재시도 콜백 (선택사항)
   * @param {string} [retryText='다시 시도'] - 버튼 텍스트
   */
  showMaintenanceError(
    message = '현재 시스템 점검 중입니다. 잠시 후 다시 시도해 주세요.',
    onRetry,
    retryText = '다시 시도'
  ) {
    set({
      blockingError: {
        type: 'maintenance',
        title: '시스템 점검',
        message,
        onRetry,
        retryText
      }
    });
  },

  /**
   * 블로킹 에러 숨기기
   */
  hide() {
    set({ blockingError: null });
  }
}));
