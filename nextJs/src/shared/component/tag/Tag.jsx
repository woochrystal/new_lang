'use client';

// ============================================================================
// Imports
// ============================================================================
import { useMemo } from 'react';

import styles from './tag.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * Tag 컴포넌트
 *
 * 라벨이나 상태를 표시하는 태그 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 태그 텍스트 또는 내용
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant='default'] - 태그 스타일
 * @param {'sm'|'md'|'lg'|'txtOnly'} [props.size='md'] - 태그 크기
 * @param {number} [props.count] - 숫자 표시 (NumTag 스타일)
 * @param {boolean} [props.removable=false] - 제거 버튼 표시 여부
 * @param {Function} [props.onRemove] - 제거 버튼 클릭 콜백
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * // 기본 태그
 * <Tag>일반</Tag>
 *
 * @example
 * // 숫자 표시
 * <Tag count={5}>미처리</Tag>
 *
 * @example
 * // 제거 가능한 태그
 * <Tag removable onRemove={() => handleRemove()}>
 *   스킬 1
 * </Tag>
 */
export const Tag = ({
  children,
  variant = 'default',
  size = 'md',
  count,
  removable = false,
  onRemove,
  className = '',
  ...rest
}) => {
  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  const tagClasses = useMemo(() => {
    return [
      styles.tag,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      count !== undefined && styles.withCount,
      removable && styles.removable,
      className
    ]
      .filter(Boolean)
      .join(' ');
  }, [variant, size, count, removable, className]);

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <span className={tagClasses} {...rest}>
      <span className={styles.tagText}>{children}</span>

      {/* 숫자 표시 */}
      {count !== undefined && <span className={styles.tagCount}>{count}</span>}

      {/* 제거 버튼 */}
      {removable && (
        <button type="button" className={styles.removeButton} onClick={onRemove} aria-label="태그 제거">
          ✕
        </button>
      )}
    </span>
  );
};

export default Tag;
