'use client';

import { Article } from '../container/Article';
import styles from './Error.module.scss';

/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 제목
 * @param {string} props.message - 메시지
 * @param {React.ReactNode} [props.icon] - 커스텀 아이콘
 * @param {string} [props.actionText] - 액션 버튼 텍스트
 * @param {Function} [props.onAction] - 액션 버튼 콜백
 * @param {'default'|'minimal'} [props.variant='default'] - 스타일 변형
 * @param {string} [props.className] - 추가 CSS 클래스
 * @returns {React.ReactNode}
 */
export const EmptyState = ({ title, message, icon, actionText, onAction, variant = 'default', className = '' }) => {
  // 기본 아이콘
  const defaultIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <Article className={`${styles.emptyStateMinimal} ${className}`}>
        {(icon || defaultIcon) && <div className={styles.emptyStateMinimalIcon}>{icon || defaultIcon}</div>}
        <h3 className={styles.emptyStateMinimalTitle}>{title}</h3>
        <p className={styles.emptyStateMinimalMessage}>{message}</p>
        {actionText && onAction && (
          <button onClick={onAction} className={styles.emptyStateMinimalButton}>
            {actionText}
          </button>
        )}
      </Article>
    );
  }

  // Default variant
  return (
    <Article className={`${styles.emptyStateContent} ${className}`}>
      {(icon || defaultIcon) && (
        <div className={styles.emptyStateIconSection}>
          <div className={styles.emptyStateIconContainer}>{icon || defaultIcon}</div>
        </div>
      )}

      <h1 className={styles.emptyStateTitle}>{title}</h1>
      <p className={styles.emptyStateMessage}>{message}</p>

      {actionText && onAction && (
        <button onClick={onAction} className={styles.emptyStateButton}>
          {actionText}
        </button>
      )}
    </Article>
  );
};

export default EmptyState;
