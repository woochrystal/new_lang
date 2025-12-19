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
 * 라디오 버튼 그룹 컴포넌트 (제어 컴포넌트)
 *
 * 여러 개의 라디오 버튼을 관리하는 그룹 컴포넌트입니다.
 * legend(라벨)은 박스 밖에 독립적으로 위치하고, 라디오 버튼은 선택적 보더 박스 안에 렌더링됩니다.
 *
 * 키보드 네비게이션:
 * - ArrowUp/ArrowLeft: 이전 옵션 선택
 * - ArrowDown/ArrowRight: 다음 옵션 선택
 * - Home: 첫 번째 옵션 선택
 * - End: 마지막 옵션 선택
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Array<{value: string, label: string}>} props.options - 라디오 옵션 배열
 * @param {string} props.value - 선택된 값 (제어형, 필수)
 * @param {Function} props.onChange - 값 변경 콜백 함수 (value: string) => void (필수)
 * @param {string} [props.label] - 그룹 레이블 텍스트 (박스 밖에 표시)
 * @param {boolean} [props.required=false] - 필수 선택 여부 (별표 * 표시)
 * @param {boolean} [props.disabled=false] - 그룹 전체 비활성화
 * @param {string} [props.type='circle'] - 라디오 렌더링 스타일
 *   - 'circle': SVG 원형 인디케이터 (기본값, @/shared/ui/Input/RadioCircle과 동일)
 *   - 'button': 버튼 스타일 라디오 (클릭 시 자주색 배경)
 * @param {boolean} [props.bordered=false] - 라디오 버튼 그룹을 보더 박스로 감싸기
 *   - true: 흰색 배경, 회색 테두리, 8px 라운드, 16px 패딩 적용
 *   - false: 박스 스타일 미적용
 * @param {string} [props.className] - 추가 CSS 클래스 (wrapper에 적용)
 * @param {Array<string>} [props.disabledValues] - 특정 옵션만 비활성화할 값 배열
 * @param {Object} [rest] - HTML 네이티브 속성 (id, data-*, 등)
 *
 * @returns {React.ReactElement} 라디오 버튼 그룹 컴포넌트
 *
 * @example
 * // 기본 원형 라디오 (bordered 없음)
 * const [role, setRole] = useState('user');
 * <RadioGroup
 *   label="사용자 역할"
 *   options={[
 *     { value: 'user', label: '일반 사용자' },
 *     { value: 'admin', label: '관리자' },
 *     { value: 'guest', label: '게스트' }
 *   ]}
 *   value={role}
 *   onChange={(value) => setRole(value)}
 *   required
 * />
 *
 * @example
 * // 버튼 스타일 + 보더 박스
 * const [selected, setSelected] = useState('option1');
 * <RadioGroup
 *   label="깊이 설정"
 *   options={[
 *     { value: 'option1', label: '얕음' },
 *     { value: 'option2', label: '중간' },
 *     { value: 'option3', label: '깊음' }
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 *   type="button"
 *   bordered
 *   required
 * />
 *
 * @example
 * // 특정 옵션 비활성화
 * <RadioGroup
 *   label="상태"
 *   options={[
 *     { value: 'active', label: '활성' },
 *     { value: 'inactive', label: '비활성' },
 *     { value: 'archived', label: '보관됨' }
 *   ]}
 *   value={status}
 *   onChange={setStatus}
 *   disabledValues={['archived']}
 * />
 */
export const RadioGroup = ({
  options = [],
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  className = '',
  type = 'circle',
  bordered = false,
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
    return [styles.radioBox, disabled && styles.disabled].filter(Boolean).join(' ');
  }, [disabled]);

  const labelId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  /**
   * 라디오 버튼 변경 핸들러
   */
  const handleChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  /**
   * 키보드 네비게이션 핸들러
   */
  const handleKeyDown = (e, currentIndex) => {
    let nextIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        for (let i = currentIndex + 1; i < options.length; i++) {
          if (!disabledValues.includes(options[i].value)) {
            nextIndex = i;
            break;
          }
        }
        if (nextIndex !== undefined) {
          handleChange(options[nextIndex].value);
        }
        break;
      }

      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (!disabledValues.includes(options[i].value)) {
            nextIndex = i;
            break;
          }
        }
        if (nextIndex !== undefined) {
          handleChange(options[nextIndex].value);
        }
        break;
      }

      case 'Home': {
        e.preventDefault();
        const firstEnabled = options.find((opt) => !disabledValues.includes(opt.value));
        if (firstEnabled) {
          handleChange(firstEnabled.value);
        }
        break;
      }

      case 'End': {
        e.preventDefault();
        const lastEnabled = [...options].reverse().find((opt) => !disabledValues.includes(opt.value));
        if (lastEnabled) {
          handleChange(lastEnabled.value);
        }
        break;
      }

      default:
        break;
    }
  };

  /**
   * 원형 라디오 SVG 렌더링 (UI RadioCircle과 동일)
   */
  const renderCircleRadio = (option, index) => {
    const isItemDisabled = disabled || disabledValues.includes(option.value);
    const isSelected = value === option.value;

    return (
      <label key={option.value} className={`${styles.radioCustom} ${isSelected ? styles.checked : ''}`}>
        <input
          type="radio"
          name={label || 'radio-group'}
          value={option.value}
          checked={isSelected}
          onChange={() => handleChange(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={isItemDisabled}
          aria-label={option.label}
        />
        <span className={styles.radioIndicator}>
          <svg className={styles.circle} viewBox="0 0 20 20" width="20" height="20" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="8" className={styles.circleOuter} />
            <circle cx="10" cy="10" r="4" className={styles.circleOn} />
          </svg>
          <span className={styles.radioLabel}>{option.label}</span>
        </span>
      </label>
    );
  };

  /**
   * 버튼형 라디오 렌더링
   */
  const renderButtonRadio = (option, index) => {
    const isItemDisabled = disabled || disabledValues.includes(option.value);
    const isSelected = value === option.value;

    return (
      <label key={option.value} className={`${styles.radioButton} ${isSelected ? styles.checked : ''}`}>
        <input
          type="radio"
          name={label || 'radio-group'}
          value={option.value}
          checked={isSelected}
          onChange={() => handleChange(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={isItemDisabled}
          aria-label={option.label}
        />
        <span className={styles.radioIndicator}>
          <span>{option.label}</span>
        </span>
      </label>
    );
  };

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <div className={containerClasses} {...rest}>
      {/* Legend - 박스 밖에 독립적으로 위치 */}
      {label && (
        <div id={labelId} className={styles.label}>
          <span className={required ? styles.required : ''}>{label}</span>
        </div>
      )}

      {/* 라디오 버튼 그룹 - bordered 스타일 감싸기 */}
      <div
        className={bordered ? styles.borderedBox : ''}
        style={disabled ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' } : {}}
      >
        <div
          className={groupClasses}
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-required={required}
        >
          {options.map((option, index) =>
            type === 'button' ? renderButtonRadio(option, index) : renderCircleRadio(option, index)
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioGroup;
