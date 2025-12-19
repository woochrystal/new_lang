/*
 * path           : src/shared/store/overlayStore.js
 * fileName       : overlayStore
 * author         : changhyeon
 * date           : 25. 11. 07.
 * description    : 모달/알림 z-index 자동 관리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 30.       changhyeon       최초 생성
 * 25. 10. 30.       changhyeon       팝업 동적 z인덱스 관리
 */

'use client';

import { create } from 'zustand';

/**
 * 오버레이(Modal, Alert, Drawer) 스택 관리 Store
 * 동적 z-index를 자동 할당하여 중첩된 오버레이를 올바르게 렌더링
 *
 * @typedef {Object} OverlayItem
 * @property {string} id - 고유 ID
 * @property {string} type - 오버레이 타입 ('modal' | 'alert' | 'drawer')
 * @property {number} zIndex - 계산된 z-index 값
 * @property {number} timestamp - 등록 시간
 */

const BASE_Z_INDEX = 5000;
const Z_INDEX_INCREMENT = 10;

/**
 * useOverlayStore - 오버레이 z-index 스택 관리
 *
 * @example
 * const store = useOverlayStore();
 * const zIndex = store.register('overlay-1', 'modal');
 * // later
 * store.unregister('overlay-1');
 */
export const useOverlayStore = create((set, get) => ({
  stack: [],

  /**
   * 오버레이를 스택에 등록하고 z-index 반환
   * 동일한 ID로 재등록하면 기존 z-index 반환 (idempotent)
   *
   * @param {string} id - 오버레이 고유 ID
   * @param {string} [type='modal'] - 오버레이 타입
   * @returns {number} 할당된 z-index 값
   */
  register: (id, type = 'modal') => {
    const { stack } = get();

    // 이미 등록된 ID면 기존 z-index 반환
    const existing = stack.find((item) => item.id === id);
    if (existing) {
      return existing.zIndex;
    }

    // 새 z-index 계산 (stack 마지막 + 10)
    const zIndex = BASE_Z_INDEX + stack.length * Z_INDEX_INCREMENT;
    const newPopup = {
      id,
      type,
      zIndex,
      timestamp: Date.now()
    };

    const zStack = [...stack, newPopup];
    set({ stack: zStack });

    // 첫 오버레이 추가 시 body 스크롤 잠금
    if (zStack.length === 1 && typeof document !== 'undefined') {
      document.body.classList.add('scroll-locked');
    }

    return zIndex;
  },

  /**
   * 오버레이를 스택에서 제거
   *
   * @param {string} id - 오버레이 고유 ID
   */
  unregister: (id) => {
    const { stack } = get();
    const filtered = stack.filter((item) => item.id !== id);
    set({ stack: filtered });

    // 마지막 오버레이 제거 시 body 스크롤 복구
    if (filtered.length === 0 && typeof document !== 'undefined') {
      document.body.classList.remove('scroll-locked');
    }
  },

  /**
   * 특정 오버레이의 z-index 조회
   *
   * @param {string} id - 오버레이 고유 ID
   * @returns {number|null} z-index 값 또는 null (미등록)
   */
  getZIndex: (id) => {
    const { stack } = get();
    const item = stack.find((item) => item.id === id);
    return item ? item.zIndex : null;
  },

  /**
   * 최상위(가장 최근) 오버레이 ID 반환
   *
   * @returns {string|null}
   */
  getTopOverlayId: () => {
    const { stack } = get();
    return stack.length > 0 ? stack[stack.length - 1].id : null;
  },

  /**
   * 로딩 컴포넌트의 z-index 반환 (모달보다 뒤에 위치)
   * @returns {number} 로딩 z-index (4900)
   */
  getLoadingZIndex: () => {
    return Math.max(4900, BASE_Z_INDEX - 100); // 모달(5000+)보다 뒤에 위치
  },

  /**
   * 전체 스택 초기화 (테스트, 에러 복구용)
   */
  clearStack: () => {
    set({ stack: [] });
  }
}));
