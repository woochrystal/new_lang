import { useEffect, useRef } from 'react';

/**
 * Focus Trap 커스텀 훅
 *
 * 모달, 다이얼로그 등에서 포커스를 특정 영역 내에 가두는 훅
 * Tab 키 이동 시 요소 내부에서만 순환하도록 제어
 *
 * @param {React.RefObject} containerRef - focus trap을 적용할 컨테이너 ref
 * @param {boolean} [isActive=true] - focus trap 활성화 여부
 * @returns {void}
 *
 * @example
 * const dialogRef = useRef(null);
 * useFocusTrap(dialogRef, isVisible);
 *
 * return <div ref={dialogRef} role="dialog">{content}</div>;
 */
export const useFocusTrap = (containerRef, isActive = true) => {
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return;
    }

    // 현재 포커스된 요소 저장 (나중에 복원)
    previousActiveElement.current = document.activeElement;

    /**
     * 포커스 가능한 요소 선택자
     * button, input, textarea, select, a[href], 그리고 tabindex 속성이 있는 요소
     */
    const FOCUSABLE_SELECTOR = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    /**
     * 포커스 가능한 요소들 가져오기
     */
    const getFocusableElements = () => {
      return Array.from(containerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || []);
    };

    /**
     * Tab 키 이벤트 처리
     */
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const [firstElement, ...otherElements] = focusableElements;
      const lastElement = otherElements[otherElements.length - 1] || firstElement;
      const { activeElement } = document;

      // Shift + Tab: 역순 이동
      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: 순서대로 이동
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 포커스 가능한 첫 번째 요소에 포커스
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      container?.removeEventListener('keydown', handleKeyDown);
      // 이전 포커스된 요소로 복원
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, containerRef]);
};

export default useFocusTrap;
