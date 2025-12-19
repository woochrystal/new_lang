'use client';

import { useRef } from 'react';

import styles from './popup.module.scss';
import useModalBehavior from './useModalBehavior';
import useFocusTrap from './useFocusTrap';
import { useOverlayZIndex } from '@/shared/hooks/useOverlayZIndex';

/**
 * 오른쪽에서 슬라이드되는 Drawer 컴포넌트
 * 데스크탑에서 가로 기본 40%, 세로 100vh
 * @param {Object} props
 * @param {ReactNode} props.children - Drawer 본문 내용
 * @param {string} [props.title] - Drawer 제목
 * @param {boolean} [props.isOpen=true] - Drawer 열림 상태
 * @param {Function} [props.onClose] - 닫기 콜백 함수
 * @param {boolean} [props.showCloseButton=true] - X 버튼 표시 여부
 * @param {boolean} [props.showHeader=true] - 헤더 표시 여부
 * @param {string} [props.placement='right'] - Drawer 위치 (right, left)
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const Drawer = ({
  children,
  title,
  isOpen = true,
  onClose,
  showCloseButton = true,
  showHeader = true,
  placement = 'right',
  className = '',
  ...props
}) => {
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const { isVisible, handleClose, handleOverlayClick } = useModalBehavior({
    isOpen,
    onClose
  });

  // 동적 z-index 관리
  useOverlayZIndex(overlayRef, 'drawer', isVisible);

  // Focus trapping
  useFocusTrap(drawerRef, isVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={styles.drawerOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
      {...props}
    >
      <div ref={drawerRef} className={`${styles.drawerContainer} ${styles[placement]} ${className}`}>
        {/* Header */}
        {showHeader && (
          <div className={styles.modalHeader}>
            {title && (
              <h2 id="drawer-title" className={styles.modalTitle}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="Drawer 닫기">
                ×
              </button>
            )}
          </div>
        )}

        {/* 바디 */}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
