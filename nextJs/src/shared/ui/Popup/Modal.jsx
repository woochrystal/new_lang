'use client';

import { useEffect } from 'react';
import styles from './Modal.module.scss';

/**
 * 모달 컴포넌트 (header/main/footer 구조)
 * @param {Object} props
 * @param {ReactNode} props.children - 모달 본문 내용
 * @param {string} [props.title='알림'] - 모달 제목
 * @param {boolean} [props.isOpen=true] - 모달 열림 상태
 * @param {Function} [props.onClose] - 닫기 콜백 함수
 * @param {Function} [props.onConfirm] - 확인 버튼 클릭 콜백
 * @param {Function} [props.onCancel] - 취소 버튼 클릭 콜백
 * @param {string} [props.confirmText='확인'] - 확인 버튼 텍스트
 * @param {string} [props.cancelText='취소'] - 취소 버튼 텍스트
 * @param {boolean} [props.showCloseButton=true] - X 버튼 표시 여부
 * @param {boolean} [props.showCancelButton=true] - 취소 버튼 표시 여부
 * @param {string} [props.variant='medium'] - 모달 크기 ('small' | 'medium' | 'large')
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export default function Modal({
  children,
  title = '알림',
  isOpen = true,
  onClose,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  showCloseButton = true,
  showCancelButton = true,
  variant = 'medium',
  className = '',
  ...props
}) {
  // ESC 키로 Modal 닫기
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body 스크롤 관리 (ref counting으로 중복 방지)
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        // 다른 모달이 없을 때만 스크롤 복원
        if (document.querySelectorAll('[role="dialog"][aria-modal="true"]').length <= 1) {
          document.body.style.overflow = originalOverflow || 'unset';
        }
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      handleClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      {...props}
    >
      <div className={`${styles.modalContainer} ${styles[variant]} ${className}`}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {title}
          </h2>
          {showCloseButton && (
            <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="모달 닫기">
              ×
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.modalMain}>{children}</div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {showCancelButton && (
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button type="button" className={styles.confirmButton} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
