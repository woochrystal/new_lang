'use client';

import { useEffect, useState } from 'react';
import styles from './Drawer.module.scss';

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
export default function Drawer({
  children,
  title,
  isOpen = true,
  onClose,
  showCloseButton = true,
  showHeader = true,
  placement = 'right',
  className = '',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(isOpen);

  // isOpen prop 변경 시 상태 동기화
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // ESC 키로 Drawer 닫기
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Drawer가 열릴 때 body 스크롤 방지 (ref counting으로 중복 방지)
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        // 다른 모달이 없을 때만 스크롤 복원
        if (document.querySelectorAll('[role="dialog"][aria-modal="true"]').length <= 1) {
          document.body.style.overflow = originalOverflow || 'unset';
        }
      };
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.drawerOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
      {...props}
    >
      <div className={`${styles.drawerContainer} ${styles[placement]} ${className}`}>
        {/* Header */}
        {showHeader && (
          <div className={styles.drawerHeader}>
            {title && (
              <h2 id="drawer-title" className={styles.drawerTitle}>
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

        {/* Content */}
        <div className={styles.drawerContent}>{children}</div>
      </div>
    </div>
  );
}
