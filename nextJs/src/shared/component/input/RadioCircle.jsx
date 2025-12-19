'use client';

// ============================================================================
// Imports
// ============================================================================
import { useMemo } from 'react';

import styles from './input.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 라디오 버튼 원형 컴포넌트 (내부용)
 *
 * Radio.Group에서 사용되는 개별 라디오 버튼 (원형 디자인)
 *
 * @param {Object} props
 * @param {string} props.name - 라디오 그룹 이름
 * @param {string} props.value - 라디오 값
 * @param {boolean} [props.checked=false] - 체크 상태
 * @param {Function} props.onChange - 값 변경 콜백 (value) => void
 * @param {React.ReactNode} props.children - 라벨 텍스트
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const RadioCircle = ({
  name,
  value,
  checked = false,
  onChange,
  children,
  disabled = false,
  className = '',
  ...rest
}) => {
  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  const labelClasses = useMemo(() => {
    return [styles.radioCustom, checked && styles.checked, disabled && styles.disabled, className]
      .filter(Boolean)
      .join(' ');
  }, [checked, disabled, className]);

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <label className={labelClasses}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(value)}
        disabled={disabled}
        {...rest}
      />
      <span className={styles.radioIndicator}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={styles.circle}>
          <circle x="1.5" y="1.5" width="17" height="17" rx="8.5" className={styles.circleOuter} />
          <circle x="5" y="5" width="10" height="10" rx="5" className={styles.circleOn} />
        </svg>
        <span className={styles.radioLabel}>{children}</span>
      </span>
    </label>
  );
};

export default RadioCircle;
