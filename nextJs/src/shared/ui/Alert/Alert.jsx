/**
 * @fileoverview Alert 컴포넌트
 * @description 모달 형태 알림 메시지 컴포넌트
 */

import { useEffect, useState } from 'react';
import styles from './Alert.module.scss';

/**
 * 모달 형태의 알림 메시지 컴포넌트
 * @param {Object} props
 * @param {string} props.message - 알림 메시지 내용
 * @param {string} [props.title] - 알림 제목 (기본값: 타입별 자동 설정)
 * @param {string} [props.type='error'] - 알림 타입 (error, warning, success, info)
 * @param {string} [props.confirmText='확인'] - 확인 버튼 텍스트
 * @param {Function} [props.onClose] - 닫기 콜백 함수
 * @param {boolean} [props.showCloseButton=true] - X 버튼 표시 여부
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const Alert = ({
  message,
  title,
  type = 'error',
  confirmText = '확인',
  onClose,
  showCloseButton = true,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
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

  if (!isVisible || !message) {
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
    return titleMap[type] || titleMap.error;
  };

  const modalTitle = title || getDefaultTitle();

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
      {...props}
    >
      <div className={`${styles.modalContainer} ${className}`}>
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
          <button type="button" className={styles.confirmButton} onClick={handleClose} autoFocus>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
