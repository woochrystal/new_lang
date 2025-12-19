'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';

import styles from './popup.module.scss';
import useModalBehavior from './useModalBehavior';
import useFocusTrap from './useFocusTrap';
import { useOverlayZIndex } from '@/shared/hooks/useOverlayZIndex';

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
 * @param {string} [props.cancelText] - 취소 버튼 텍스트 (제공 시 버튼 표시)
 * @param {boolean} [props.showCloseButton=true] - X 버튼 표시 여부
 * @param {string} [props.variant='medium'] - 모달 크기 ('small' | 'medium' | 'large')
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * // 기본 사용법 (내용만 있는 모달)
 * function App() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>모달 열기</button>
 *       {isOpen && (
 *         <Modal title="기본 모달" isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *           <p>모달의 내용입니다.</p>
 *         </Modal>
 *       )}
 *     </>
 *   );
 * }
 *
 * @example
 * // 확인/취소 버튼이 있는 모달
 * function App() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   // 모달을 닫는 헬퍼 함수
 *   const handleClose = () => setIsOpen(false);
 *
 *   const handleConfirm = () => {
 *     console.log('확인됨 (저장 처리 로직)');
 *     // 중요: onConfirm을 사용하면 Modal이 자동으로 닫히지 않습니다.
 *     // 비동기 작업(저장)이 완료된 후, 수동으로 닫아야 합니다.
 *     handleClose();
 *   };
 *
 *   const handleCancel = () => console.log('취소됨');
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>확인 모달 열기</button>
 *       {isOpen && (
 *         <Modal
 *           title="저장 확인"
 *           isOpen={isOpen}
 *           onClose={handleClose} // 닫기 버튼/오버레이 클릭 시 호출
 *           onConfirm={handleConfirm} // '저장' 버튼 클릭 시 호출
 *           onCancel={handleCancel}
 *           confirmText="저장"
 *           cancelText="취소"
 *         >
 *           <p>정말로 저장하시겠습니까?</p>
 *         </Modal>
 *       )}
 *     </>
 *   );
 * }
 */
export const Modal = ({
  children,
  title = '알림',
  isOpen = true,
  onClose,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText,
  showCloseButton = true,
  showFooter = true,
  variant = 'medium',
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const { isVisible, handleClose, handleOverlayClick } = useModalBehavior({
    isOpen,
    onClose
  });

  // 동적 z-index 관리
  useOverlayZIndex(overlayRef, 'modal', isVisible);

  // Focus trapping
  useFocusTrap(modalRef, isVisible);

  const handleConfirm = () => {
    // onConfirm 실행 후, 호출 측에 닫기 처리를 위임
    if (onConfirm) {
      onConfirm();
    } else {
      handleClose();
    }
  };

  const handleCancelClick = () => {
    handleClose();
    if (onCancel) {
      onCancel();
    }
  };

  if (!isVisible) {
    return null;
  }

  // confirm 모드 여부 (cancelText가 있으면 confirm 모드)
  const isConfirmMode = !!cancelText;

  // 확인 버튼의 클릭 핸들러: onConfirm prop이 있으면 handleConfirm을 사용 (외부 로직 수행),
  // 아니면 기본 닫기 handleClose를 사용
  const confirmHandler = onConfirm ? handleConfirm : handleClose;

  const modalContent = (
    <div
      ref={overlayRef}
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      {...props}
    >
      <div ref={modalRef} className={`${styles.modalContainer} ${styles[variant]} ${className}`}>
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
        <div className={styles.modalBody}>{children}</div>

        {/* Footer */}
        {showFooter && (
          <div className={styles.modalFooter}>
            <div className={styles.buttonGroup}>
              {/*
                1. 확인 버튼: onConfirm이 전달되면 외부 로직(handleConfirm) 수행, 아니면 기본 닫기(handleClose) 수행
                2. 취소 버튼: cancelText가 전달되었을 때만 표시
              */}
              <button
                type="button"
                className={styles.confirmButton}
                onClick={confirmHandler} // 로직에 따라 결정된 핸들러 사용
                autoFocus
              >
                {confirmText}
              </button>

              {isConfirmMode && (
                <button type="button" className={styles.cancelButton} onClick={handleCancelClick}>
                  {cancelText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
