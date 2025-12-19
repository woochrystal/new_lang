/*
 * path           : src/shared/hooks/useOverlayZIndex.js
 * fileName       : useOverlayZIndex
 * author         : changhyeon
 * date           : 25. 10. 30.
 * description    : 오버레이 z-index 자동 할당 및 관리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 30.       changhyeon       최초 생성
 * 25. 10. 30.       changhyeon       팝업 동적 z인덱스 관리
 * 25. 11. 07.       changhyeon       파일 위치 정리
 */

'use client';

import { useEffect, useId } from 'react';

import { useOverlayStore } from '@/shared/store';

/**
 * 오버레이 컴포넌트의 z-index를 동적으로 관리하는 훅
 * ref를 사용하여 JSX에 인라인 스타일을 추가하지 않음
 *
 * 동작:
 * - useId로 고유 ID 생성
 * - isOpen이 true면 overlayStore에 등록 및 z-index 할당
 * - ref.current.style.zIndex에 값 설정
 * - isOpen이 false면 자동으로 스택에서 제거
 *
 * @param {React.MutableRefObject} ref - z-index를 적용할 DOM 요소의 ref
 * @param {string} [type='modal'] - 오버레이 타입 ('modal' | 'alert' | 'drawer')
 * @param {boolean} [isOpen=true] - 오버레이 열림 상태
 *
 * @example
 * // Modal.jsx
 * const overlayRef = useRef(null);
 * useOverlayZIndex(overlayRef, 'modal', isVisible);
 *
 * return (
 *   <div ref={overlayRef} className={styles.modalOverlay}>
 *     // 인라인 스타일 없음 - z-index는 useEffect에서 자동 설정
 *   </div>
 * );
 */
export const useOverlayZIndex = (ref, type = 'modal', isOpen = true) => {
  const id = useId(); // React 18+ 고유 ID 생성
  const register = useOverlayStore((state) => state.register);
  const unregister = useOverlayStore((state) => state.unregister);

  useEffect(() => {
    if (!ref?.current || !isOpen) {
      // isOpen이 false면 스택에서 제거
      if (!isOpen) {
        unregister(id);
      }
      return;
    }

    // isOpen이 true면 스택에 등록 및 z-index 설정
    const zIndex = register(id, type);

    // DOM 요소에 z-index 직접 설정
    ref.current.style.zIndex = zIndex.toString();

    // cleanup: 언마운트 시 스택에서 제거
    return () => {
      unregister(id);
    };
  }, [isOpen, id, type, ref, register, unregister]);
};

export default useOverlayZIndex;
