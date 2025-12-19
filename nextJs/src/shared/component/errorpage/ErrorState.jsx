'use client';

import { Article } from '../container/Article';
import styles from './Error.module.scss';

/**
 * 페이지나 섹션에서 데이터 로드 실패 시 표시하는 에러 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {'error'|'network'|'server'|'notFound'} [props.type='error'] - 에러 타입
 * @param {string} props.title - 에러 제목
 * @param {string} props.message - 에러 메시지
 * @param {Function} [props.onRetry] - 재시도 버튼 콜백
 * @param {string} [props.retryText='다시 시도'] - 재시도 버튼 텍스트
 * @param {boolean} [props.showIcon=true] - 아이콘 표시 여부
 * @param {'default'|'minimal'} [props.variant='default'] - 스타일 변형
 * @param {string} [props.className] - 추가 CSS 클래스
 * @returns {React.ReactNode}
 */
export const ErrorState = ({
  type = 'error',
  title,
  message,
  onRetry,
  retryText = '다시 시도',
  showIcon = true,
  variant = 'default',
  className = ''
}) => {
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
              strokeWidth={1.5}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        );
      case 'server':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case 'notFound':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10a4 4 0 018 0"
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

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <Article className={`${styles.errorStateMinimal} ${className}`}>
        {showIcon && <div className={styles.errorStateMinimalIcon}>{getIconSvg()}</div>}
        <h3 className={styles.errorStateMinimalTitle}>{title}</h3>
        <p className={styles.errorStateMinimalMessage}>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className={styles.errorStateMinimalButton}>
            {retryText}
          </button>
        )}
      </Article>
    );
  }

  // Default variant
  return (
    <Article className={`${styles.errorStateContent} ${className}`}>
      {showIcon && (
        <div className={styles.errorStateIconSection}>
          <div className={styles.errorStateIconContainer}>{getIconSvg()}</div>
        </div>
      )}

      <h1 className={styles.errorStateTitle}>{title}</h1>
      <p className={styles.errorStateMessage}>{message}</p>

      {onRetry && (
        <button onClick={onRetry} className={styles.errorStateButton}>
          {retryText}
        </button>
      )}
    </Article>
  );
};

export default ErrorState;
