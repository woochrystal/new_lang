'use client';

// ============================================================================
// Imports
// ============================================================================
import styles from './input.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 체크박스 컴포넌트 (제어 컴포넌트)
 *
 * @param {Object} props
 * @param {string} props.id - 체크박스 ID (라벨과 연결)
 * @param {string} [props.name] - 체크박스 name 속성
 * @param {boolean} props.checked - 체크 상태 (제어형, 필수)
 * @param {Function} props.onChange - 상태 변경 콜백 (checked, event) => void (필수)
 * @param {React.ReactNode} props.children - 라벨 텍스트
 * @param {'purple'|'white'} [props.variant='purple'] - 체크 마크 색상
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLInputElement>} [props.ref] - checkbox 입력 요소에 전달할 ref
 * @param {Object} [rest] - HTML input 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * const [agree, setAgree] = useState(false);
 * <Checkbox
 *   id="agree"
 *   checked={agree}
 *   onChange={(checked) => setAgree(checked)}
 * >
 *   개인정보 수집 동의
 * </Checkbox>
 *
 * @example
 * // variant 변경 (검은 배경)
 * <Checkbox
 *   id="dark_agree"
 *   variant="white"
 *   checked={agree}
 *   onChange={(checked) => setAgree(checked)}
 * >
 *   동의합니다
 * </Checkbox>
 */
export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  children,
  variant = 'purple',
  disabled = false,
  className = '',
  ref,
  ...rest
}) => {
  const containerClasses = [
    styles.checkWrap,
    checked ? styles.checked : '',
    variant === 'white' ? styles.hasFFF : '',
    disabled ? styles.disabled : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e) => {
    if (onChange) {
      onChange(Boolean(e.target.checked), e);
    }
  };

  return (
    <div className={containerClasses}>
      <input
        ref={ref}
        type="checkbox"
        name={name}
        id={id}
        checked={Boolean(checked)}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
      <label htmlFor={id}>
        <i>
          <img src={variant === 'white' ? '/check_fff.svg' : '/check_purple.svg'} alt="체크 마크" />
        </i>
        <span>{children}</span>
      </label>
    </div>
  );
};

export default Checkbox;
