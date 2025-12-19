'use client';

// ============================================================================
// Imports
// ============================================================================
import Label from './Label';
import { useCallback, useState, useMemo } from 'react';

import styles from './input.module.scss';

// ============================================================================
// Constants
// ============================================================================

const INPUT_VARIANTS = {
  TEXT: 'text',
  PASSWORD: 'password',
  SEARCH: 'search',
  EMAIL: 'email',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url'
};

// ============================================================================
// Component
// ============================================================================

/**
 * 텍스트 입력 컴포넌트
 *
 * ⚠️ 제어 컴포넌트: value + onChange 조합 필수
 *
 * @param {Object} props
 * @param {string} [props.variant='text'] - 입력 타입: 'text' | 'password' | 'search' | 'email' | 'number' | 'tel' | 'url'
 * @param {string} [props.label] - 레이블 텍스트
 * @param {boolean} [props.required=false] - 필수 입력 여부 (별표 표시)
 * @param {string} [props.id] - input ID (설명/오류 메시지 연결 시 필수)
 * @param {string} [props.name] - input name
 * @param {string} [props.placeholder=''] - placeholder 텍스트
 * @param {string} props.value - 입력 값 (필수)
 * @param {Function} props.onChange - 값 변경 콜백 (e) => void (필수)
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {boolean} [props.readOnly=false] - 읽기 전용 여부
 * @param {number} [props.maxLength] - 최대 입력 길이
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {Function} [props.onBlur] - 포커스 아웃 콜백
 * @param {Function} [props.onFocus] - 포커스 인 콜백
 * @param {Function} [props.onSearch] - 검색 실행 콜백 (variant='search'일 때)
 * @param {Function} [props.onClear] - 검색 초기화 콜백 (variant='search'일 때)
 * @param {string} [props.autoComplete='off'] - 자동완성 설정
 * @param {string} [props.description] - 입력 필드 설명 텍스트 (aria-describedby 연결)
 * @param {string} [props.error] - 입력 필드 오류 메시지 (aria-describedby + aria-invalid 연결)
 * @param {React.Ref} [props.ref] - input 요소 ref
 * @param {Object} [rest] - HTML input 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * const [name, setName] = useState('');
 * <Input
 *   label="이름"
 *   id="name-input"
 *   required={true}
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   placeholder="이름을 입력하세요"
 * />
 *
 * @example
 * const [password, setPassword] = useState('');
 * <Input
 *   variant="password"
 *   label="비밀번호"
 *   id="password-input"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   description="최소 8자 이상의 영문, 숫자, 특수문자 조합"
 * />
 *
 * @example
 * const [email, setEmail] = useState('');
 * const [emailError, setEmailError] = useState('');
 * <Input
 *   variant="email"
 *   label="이메일"
 *   id="email-input"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 * />
 */
export const Input = ({
  variant = 'text',
  label,
  required = false,
  id,
  name,
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  readOnly = false,
  maxLength,
  className = '',
  onBlur,
  onFocus,
  onSearch,
  onClear,
  autoComplete = 'off',
  ref,
  description,
  error,
  ...rest
}) => {
  // ==========================================================================
  // Data (상태 관리)
  // ==========================================================================

  // 비밀번호 표시 상태
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  // input type 결정
  const inputType = useMemo(() => {
    if (variant === INPUT_VARIANTS.PASSWORD) {
      return showPassword ? INPUT_VARIANTS.TEXT : INPUT_VARIANTS.PASSWORD;
    }
    return variant;
  }, [variant, showPassword]);

  // CSS 클래스 결정
  const wrapperClasses = useMemo(() => {
    return [styles.wrapper, variant === INPUT_VARIANTS.SEARCH && styles.searchWrapper, className]
      .filter(Boolean)
      .join(' ');
  }, [variant, className]);

  const inputClasses = useMemo(() => {
    return [
      styles.input,
      variant === INPUT_VARIANTS.PASSWORD && styles.passwordInput,
      variant === INPUT_VARIANTS.SEARCH && styles.searchInput,
      disabled && styles.disabled,
      readOnly && styles.readOnly
    ]
      .filter(Boolean)
      .join(' ');
  }, [variant, disabled, readOnly]);

  const inputContainerClasses = useMemo(() => {
    return [styles.inputContainer, disabled && styles.inputDisabledWrap].filter(Boolean).join(' ');
  }, [disabled]);

  // aria-describedby 생성
  const descriptionId = id ? `${id}-description` : undefined;
  const errorId = id ? `${id}-error` : undefined;
  const ariaDescribedBy = [error && errorId, description && descriptionId].filter(Boolean).join(' ') || undefined;

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  /**
   * 검색 실행 핸들러
   */
  const handleSearch = useCallback(() => {
    onSearch?.(value);
  }, [value, onSearch]);

  /**
   * 검색 초기화 핸들러
   */
  const handleClear = useCallback(() => {
    onClear?.();
  }, [onClear]);

  /**
   * Enter 키 처리 (검색용)
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && variant === INPUT_VARIANTS.SEARCH) {
        e.preventDefault();
        handleSearch();
      }
    },
    [variant, handleSearch]
  );

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <div className={wrapperClasses}>
      {/* 레이블 */}
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {/* 입력 컨테이너 */}
      <div className={inputContainerClasses}>
        {/* 입력 필드 */}
        <input
          ref={ref}
          type={inputType}
          id={id}
          name={name || id}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={inputClasses}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={variant === INPUT_VARIANTS.SEARCH ? handleKeyDown : undefined}
          aria-required={required}
          aria-label={label || placeholder}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? 'true' : undefined}
          {...rest}
        />

        {/* 비밀번호 표시/숨김 버튼 */}
        {variant === INPUT_VARIANTS.PASSWORD && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
          >
            <img src={showPassword ? '/pwShowBtn_on.svg' : '/pwShowBtn_off.svg'} alt="비밀번호 표시/숨김" />
          </button>
        )}

        {/* 검색 관련 버튼 */}
        {variant === INPUT_VARIANTS.SEARCH && (
          <>
            {/* 삭제 버튼 (값이 있을 때만 표시) */}
            {value && (
              <button type="button" className={styles.clearButton} onClick={handleClear} aria-label="검색어 삭제">
                <img src="/delete.png" alt="검색어 삭제" />
              </button>
            )}

            {/* 검색 버튼 */}
            <button
              type="button"
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={disabled}
              aria-label="검색"
            >
              <img src="/search.png" alt="검색" />
            </button>
          </>
        )}
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div id={errorId} className={styles.error} role="alert">
          {error}
        </div>
      )}

      {/* 설명 텍스트 */}
      {description && (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      )}
    </div>
  );
};

export default Input;
