'use client';

// ============================================================================
// Imports
// ============================================================================
import { useMemo } from 'react';

import Checkbox from './Checkbox';
import styles from './input.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 체크박스 그룹 컴포넌트 (제어 컴포넌트)
 *
 * 여러 개의 체크박스를 관리하는 그룹 컴포넌트입니다.
 * 각 체크박스의 상태를 배열로 관리합니다.
 * fieldset + legend 패턴으로 시맨틱한 구조를 제공합니다.
 * 키보드 네비게이션: Arrow Up/Down, Home/End로 포커스 이동 가능
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - 체크박스 옵션 배열
 * @param {Array<string>} props.values - 선택된 값 배열 (제어형, 필수)
 * @param {Function} props.onChange - 값 변경 콜백 (values) => void (필수)
 * @param {string} [props.label] - 그룹 레이블 텍스트
 * @param {boolean} [props.required=false] - 필수 선택 여부 (별표 표시)
 * @param {'purple'|'white'} [props.variant='purple'] - 체크 마크 색상
 * @param {boolean} [props.disabled=false] - 그룹 전체 비활성화
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {Array<string>} [props.disabledValues] - 특정 옵션만 비활성화 (값 배열)
 * @param {Object} [rest] - HTML 네이티브 속성
 *
 * @example
 * const [tags, setTags] = useState(['react']);
 * <CheckboxGroup
 *   label="기술 스택"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'next', label: 'Next.js' },
 *     { value: 'vue', label: 'Vue' }
 *   ]}
 *   values={tags}
 *   onChange={(values) => setTags(values)}
 * />
 *
 * @example
 * // 일부 옵션만 비활성화
 * <CheckboxGroup
 *   label="선택사항"
 *   options={[...]}
 *   values={selected}
 *   onChange={setSelected}
 *   disabledValues={['deprecated']}
 * />
 */
export const CheckboxGroup = ({
  options = [],
  values = [],
  onChange,
  label,
  required = false,
  variant = 'purple',
  disabled = false,
  className = '',
  disabledValues = [],
  ...rest
}) => {
  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  const containerClasses = useMemo(() => {
    return [styles.wrapper, className].filter(Boolean).join(' ');
  }, [className]);

  const groupClasses = useMemo(() => {
    return [styles.checkboxGroup, disabled && styles.disabled].filter(Boolean).join(' ');
  }, [disabled]);

  const labelId = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  /**
   * 체크박스 변경 핸들러
   */
  const handleChange = (value, isChecked) => {
    let newValues;
    if (isChecked) {
      // 추가
      newValues = [...values, value];
    } else {
      // 제거
      newValues = values.filter((v) => v !== value);
    }
    onChange?.(newValues);
  };

  /**
   * 키보드 네비게이션 핸들러
   */
  const handleKeyDown = (e, currentIndex) => {
    const checkboxes = Array.from(document.querySelectorAll(`[data-checkbox-group="${labelId}"]`)).filter(
      (el) => !el.disabled
    );

    if (checkboxes.length === 0) return;

    let nextCheckbox;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        nextCheckbox = checkboxes[(currentIndex + 1) % checkboxes.length];
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        nextCheckbox = checkboxes[(currentIndex - 1 + checkboxes.length) % checkboxes.length];
        break;
      }

      case 'Home': {
        e.preventDefault();
        nextCheckbox = checkboxes[0];
        break;
      }

      case 'End': {
        e.preventDefault();
        nextCheckbox = checkboxes[checkboxes.length - 1];
        break;
      }

      default:
        return;
    }

    if (nextCheckbox) {
      nextCheckbox.focus();
    }
  };

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <fieldset className={containerClasses} disabled={disabled} {...rest}>
      {/* Legend (필수 - fieldset의 첫 자식) */}
      {label && (
        <legend id={labelId} className={styles.label}>
          <span className={required ? styles.required : ''}>{label}</span>
        </legend>
      )}

      {/* 체크박스 그룹 */}
      <div className={groupClasses} role="group" aria-labelledby={label ? labelId : undefined} aria-required={required}>
        {options.map((option, index) => {
          const isItemDisabled = disabled || disabledValues.includes(option.value);
          const isChecked = values.includes(option.value);

          return (
            <Checkbox
              key={option.value}
              id={`checkbox-${option.value}`}
              name={option.value}
              checked={isChecked}
              onChange={(checked) => handleChange(option.value, checked)}
              variant={variant}
              disabled={isItemDisabled}
              onKeyDown={(e) => handleKeyDown(e, index)}
              data-checkbox-group={labelId}
            >
              {option.label}
            </Checkbox>
          );
        })}
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;
