'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import styles from './popup.module.scss';
import useModalBehavior from './useModalBehavior';
import useFocusTrap from './useFocusTrap';
import { useOverlayZIndex } from '@/shared/hooks/useOverlayZIndex';

/**
 * 모달 형태의 알림 메시지 컴포넌트
 * @param {Object} props
 * @param {string} props.message - 알림 메시지 내용
 * @param {string} [props.title] - 알림 제목 (기본값: 타입별 자동 설정)
 * @param {string} [props.variant='error'] - 알림 타입 (error, warning, success, info)
 * @param {string} [props.confirmText='확인'] - 확인 버튼 텍스트
 * @param {string} [props.cancelText] - 취소 버튼 텍스트 (제공 시 confirm 모드)
 * @param {Function} [props.onClose] - 닫기 콜백 함수
 * @param {Function} [props.onConfirm] - 확인 버튼 콜백
 * @param {Function} [props.onCancel] - 취소 버튼 콜백


 * @param {boolean} [props.showCloseButton=true] - X 버튼 표시 여부
 * @param {number} [props.autoClose=null] - 자동 닫기 시간(ms). null이면 수동 닫기
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const Alert = ({
  message,
  title,
  variant,
  confirmText = '확인',
  cancelText,
  onClose,
  onConfirm,
  onCancel,
  showCloseButton = true,
  autoClose = null,
  className = '',
  ...props
}) => {
  const alertRef = useRef(null);
  const overlayRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  const alertType = variant || 'error';

  // confirm 모드
  const isConfirmMode = !!(cancelText || onConfirm);

  // 오버레이 클릭 핸들러
  // confirm 모드에서는 취소 처리, 아니면 닫기
  const customHandleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isConfirmMode) {
        handleCancel?.();
      } else {
        handleClose?.();
      }
    }
  };

  const {
    isVisible: modalVisible,
    handleClose,
    handleOverlayClick
  } = useModalBehavior({
    isOpen: isVisible,
    onClose: () => {
      setIsVisible(false);
      if (onClose) onClose();
    },
    onOverlayClick: customHandleOverlayClick
  });

  // 동적 z-index 관리
  useOverlayZIndex(overlayRef, 'alert', modalVisible);

  // Focus trapping
  useFocusTrap(alertRef, modalVisible);

  // ESC 키 핸들러
  useEffect(() => {
    if (!modalVisible) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modalVisible, handleClose]);

  // autoClose 타이머
  useEffect(() => {
    if (!modalVisible || !autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, autoClose);

    return () => clearTimeout(timer);
  }, [modalVisible, autoClose, onClose]);

  const handleConfirm = () => {
    // 콜백 실행
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose();
    }
    // 상태 변경 (Alert 닫기)
    setIsVisible(false);
  };

  const handleCancel = () => {
    // 콜백 실행
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
    // 상태 변경 (Alert 닫기)
    setIsVisible(false);
  };

  if (!modalVisible || !message) {
    return null;
  }

  // 타입별 기본 제목 설정
  const getDefaultTitle = () => {
    const titleMap = {
      error: '오류',
      warning: '경고',
      success: '성공',
      info: '알림'
    };
    return titleMap[alertType] || titleMap.error;
  };

  const modalTitle = title || getDefaultTitle();

  const alertContent = (
    <div
      ref={overlayRef}
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
      {...props}
    >
      <div ref={alertRef} className={`${styles.modalContainer} ${className}`}>
        {/* 헤더 */}
        <div className={styles.modalHeader}>
          <h2 id="alert-title" className={styles.modalTitle}>
            {modalTitle}
          </h2>
          {showCloseButton && (
            <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="알림 닫기">
              ×
            </button>
          )}
        </div>

        {/* 바디 */}
        <div className={styles.modalBody}>
          <p id="alert-message" className={styles.modalMessage}>
            {message}
          </p>
        </div>

        {/* 푸터 */}
        <div className={styles.modalFooter}>
          <div className={styles.buttonGroup}>
            {isConfirmMode ? (
              // Confirm 모드
              <>
                <button
                  type="button"
                  className={`${styles.confirmButton} ${alertType === 'warning' ? styles.danger : ''}`}
                  onClick={handleConfirm}
                  autoFocus
                >
                  {confirmText}
                </button>
                <button
                  type="button"
                  className={`${styles.cancelButton} ${alertType === 'warning' ? styles.primary : ''}`}
                  onClick={handleCancel}
                >
                  {cancelText || '취소'}
                </button>
              </>
            ) : (
              // 기본 모드
              <button type="button" className={styles.confirmButton} onClick={handleClose} autoFocus>
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(alertContent, document.body);
};

export default Alert;
