'use client';

// ============================================================================
// Imports
// ============================================================================
import { useMemo } from 'react';

import RadioCircle from './RadioCircle';
import RadioButton from './RadioButton';
import styles from './input.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 라디오 버튼 그룹 컴포넌트 (제어 컴포넌트)
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - 라디오 옵션 배열
 * @param {string} props.name - 라디오 그룹 이름
 * @param {string} props.value - 선택된 값 (제어형, 필수)
 * @param {Function} props.onChange - 값 변경 콜백 (value) => void (필수)
 * @param {'circle'|'button'} [props.variant='circle'] - 라디오 버튼 스타일
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 * @param {Object} [rest] - HTML 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * // 원형 라디오 버튼 그룹
 * const [gender, setGender] = useState('male');
 * <Radio
 *   name="gender"
 *   options={[
 *     { value: 'male', label: '남성' },
 *     { value: 'female', label: '여성' }
 *   ]}
 *   value={gender}
 *   onChange={(value) => setGender(value)}
 * />
 *
 * @example
 * // 버튼형 라디오 버튼 그룹
 * const [status, setStatus] = useState('pending');
 * <Radio
 *   variant="button"
 *   name="status"
 *   options={[
 *     { value: 'pending', label: '대기' },
 *     { value: 'approved', label: '승인' },
 *     { value: 'rejected', label: '반려' }
 *   ]}
 *   value={status}
 *   onChange={(value) => setStatus(value)}
 * />
 */
const Radio = ({ options = [], name, value, onChange, variant = 'circle', className = '', ref, ...rest }) => {
  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  const containerClasses = useMemo(() => {
    return [styles.radioBox, className].filter(Boolean).join(' ');
  }, [className]);

  const RadioComponent = variant === 'button' ? RadioButton : RadioCircle;

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  const handleChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {options.map((option, index) => (
        <RadioComponent
          key={index}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={handleChange}
        >
          {option.label}
        </RadioComponent>
      ))}
    </div>
  );
};

export default Radio;
