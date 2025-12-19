'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import styles from './Error.module.scss';

/**
 * 전체 화면을 차단하는 에러 컴포넌트
 * Portal로 body에 렌더링되며, ESC 키나 Overlay 클릭으로 닫을 수 없습니다.
 *
 * @param {Object} props
 * @param {'network'|'auth'|'server'|'maintenance'} props.type - 에러 타입
 * @param {string} props.title - 에러 제목
 * @param {string} props.message - 에러 메시지
 * @param {Function} props.onRetry - 재시도 콜백 (필수)
 * @param {string} [props.retryText='다시 시도'] - 재시도 버튼 텍스트
 * @returns {React.ReactNode}
 */
export const BlockingError = ({ type = 'network', title, message, onRetry, retryText = '다시 시도' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIconSvg = () => {
    const iconProps = {
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    };

    switch (type) {
      case 'network':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        );
      case 'auth':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        );
      case 'server':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case 'maintenance':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v2m-6-2a2 2 0 11-4 0 2 2 0 014 0zM16 20H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0 4h.01m-6.938-4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
    }
  };

  if (!mounted) return null;

  const content = (
    <div className={styles.blockingOverlay}>
      <div className={styles.blockingContent}>
        {/* 아이콘 */}
        <div className={styles.blockingIconSection}>
          <div className={styles.blockingIconContainer}>{getIconSvg()}</div>
        </div>

        {/* 제목 */}
        <h1 className={styles.blockingTitle}>{title}</h1>

        {/* 메시지 */}
        <p className={styles.blockingMessage}>{message}</p>

        {/* 재시도 버튼 */}
        <button onClick={onRetry} className={styles.blockingButton} autoFocus>
          {retryText}
        </button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default BlockingError;
