/*
 * path           : src/shared/auth/logoutSync.js
 * fileName       : logoutSync
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : BroadcastChannel을 통한 탭 간 로그아웃 동기화
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 */

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('LogoutSync');

const LOGOUT_CHANNEL = 'pentaware-logout';
const useBroadcastChannelSupported = typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined';

let logoutChannel = null;

/**
 * 다른 탭에서 로그아웃하면 이 탭도 자동으로 로그아웃되도록 설정
 * BroadcastChannel(모던 브라우저) 또는 storage 이벤트(구형 브라우저)로 감지
 *
 * @param {Function} onLogoutDetected - 다른 탭의 로그아웃을 감지했을 때 실행
 * @example
 * initLogoutSync(() => {
 *   window.location.href = '/login';
 * });
 */
export const initLogoutSync = (onLogoutDetected) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!useBroadcastChannelSupported) {
    logger.warn('[LogoutSync] BroadcastChannel not supported, using fallback');
    return;
  }

  if (logoutChannel) {
    return; // 이미 초기화됨
  }

  try {
    logoutChannel = new BroadcastChannel(LOGOUT_CHANNEL);
    logoutChannel.onmessage = (event) => {
      if (event.data?.type === 'LOGOUT') {
        logger.info('[LogoutSync] Logout detected from another tab');
        onLogoutDetected();
      }
    };
  } catch (error) {
    logger.warn('[LogoutSync] Failed to initialize BroadcastChannel:', error);
  }
};

/**
 * 현재 탭에서 로그아웃할 때 다른 모든 탭에 알림
 */
export const broadcastLogout = () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!useBroadcastChannelSupported) {
    // 구형 브라우저: storage 이벤트 폴백
    try {
      localStorage.setItem('logout-event', Date.now().toString());
      localStorage.removeItem('logout-event');
    } catch (error) {
      logger.warn('[LogoutSync] Failed to set logout event:', error);
    }
    return;
  }

  if (logoutChannel) {
    try {
      logoutChannel.postMessage({
        type: 'LOGOUT',
        timestamp: Date.now()
      });
    } catch (error) {
      logger.warn('[LogoutSync] Failed to post logout message:', error);
    }
  }
};

/**
 * 리소스 정리 (BroadcastChannel 닫기)
 * 필요하면 수동으로 호출 가능하지만 보통은 브라우저가 자동으로 처리
 */
export const cleanupLogoutSync = () => {
  if (logoutChannel) {
    try {
      logoutChannel.close();
    } catch (error) {
      logger.warn('[LogoutSync] Failed to close BroadcastChannel:', error);
    }
    logoutChannel = null;
  }
};

/**
 * BroadcastChannel을 지원 안 하는 구형 브라우저용 대체 방법
 * localStorage 변경 이벤트를 감시해서 다른 탭의 로그아웃을 감지
 *
 * @param {Function} onLogoutDetected - 다른 탭의 로그아웃을 감지했을 때 실행
 */
export const initLogoutSyncFallback = (onLogoutDetected) => {
  if (typeof window === 'undefined' || useBroadcastChannelSupported) {
    return;
  }

  try {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-event') {
        logger.info('[LogoutSync] Logout detected via storage event (fallback)');
        onLogoutDetected();
      }
    });
  } catch (error) {
    logger.warn('[LogoutSync] Failed to set up storage listener:', error);
  }
};
