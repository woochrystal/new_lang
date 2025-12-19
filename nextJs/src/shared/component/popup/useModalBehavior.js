/*
 * 변경 이력:
 * 2025-11-11: handleClose 함수 useCallback으로 감싸기 (의존성 최적화)
 * 2025-11-18: overlayStore 사용하여 스크롤 관리 일원화 (register/unregister에 통합)
 */
import { useCallback, useEffect, useState } from 'react';

/**
 * Modal, Drawer, Alert이 공유하는 행동 로직을 관리하는 커스텀 훅
 *
 * 처리 내용:
 * - isOpen prop과 isVisible 상태 동기화
 * - ESC 키로 모달 닫기
 * - Body 스크롤 방지 (ref counting으로 중복 방지)
 * - Overlay 클릭 이벤트 처리
 *
 * @param {Object} options
 * @param {boolean} [options.isOpen=true] - 모달 열림 상태
 * @param {Function} [options.onClose] - 닫기 콜백
 * @param {Function} [options.onOverlayClick] - 오버레이 클릭 콜백
 * @returns {Object} { isVisible, handleClose, handleOverlayClick }
 *
 * @example
 * const { isVisible, handleClose, handleOverlayClick } = useModalBehavior({
 *   isOpen: props.isOpen,
 *   onClose: props.onClose
 * });
 */
export const useModalBehavior = ({ isOpen = true, onClose, onOverlayClick } = {}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  // isOpen prop 변경 시 상태 동기화
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // handleClose 정의
  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // ESC 키로 모달 닫기
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
  }, [isVisible, handleClose]);

  const handleOverlayClickDefault = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return {
    isVisible,
    handleClose,
    handleOverlayClick: onOverlayClick || handleOverlayClickDefault
  };
};

export default useModalBehavior;
