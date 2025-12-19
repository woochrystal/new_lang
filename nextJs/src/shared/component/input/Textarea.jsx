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
 * 텍스트 영역 입력 컴포넌트
 *
 * 여러 줄의 텍스트를 입력할 수 있는 컴포넌트
 * Input 컴포넌트와 유사한 API를 제공합니다.
 *
 * ⚠️ 제어 컴포넌트: value + onChange 조합 필수
 *
 * @param {Object} props
 * @param {string} [props.label] - 레이블 텍스트
 * @param {boolean} [props.required=false] - 필수 입력 여부 (별표 표시)
 * @param {string} [props.id] - textarea ID (설명/오류 메시지 연결 시 필수)
 * @param {string} [props.name] - textarea name
 * @param {string} [props.placeholder=''] - placeholder 텍스트
 * @param {string} props.value - 입력 값 (필수)
 * @param {Function} props.onChange - 값 변경 콜백 (e) => void (필수)
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {boolean} [props.readOnly=false] - 읽기 전용 여부
 * @param {number} [props.rows=4] - 기본 행 높이
 * @param {number} [props.cols] - 열 너비
 * @param {number} [props.maxLength] - 최대 입력 길이
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {Function} [props.onBlur] - 포커스 아웃 콜백
 * @param {Function} [props.onFocus] - 포커스 인 콜백
 * @param {string} [props.description] - 입력 필드 설명 텍스트 (aria-describedby 연결)
 * @param {string} [props.error] - 입력 필드 오류 메시지 (aria-describedby + aria-invalid 연결)
 * @param {React.Ref} [props.ref] - textarea 요소 ref
 * @param {Object} [rest] - HTML textarea 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * // 기본 textarea
 * const [content, setContent] = useState('');
 * <Textarea
 *   label="내용"
 *   id="content-input"
 *   value={content}
 *   onChange={(e) => setContent(e.target.value)}
 *   rows={5}
 * />
 *
 * @example
 * // 필수 입력 + 설명 텍스트
 * <Textarea
 *   label="설명"
 *   id="description-input"
 *   required={true}
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   maxLength={500}
 *   description="최대 500자까지 입력 가능합니다"
 * />
 */
export const Textarea = ({
  label,
  required = false,
  id,
  name,
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  readOnly = false,
  rows = 4,
  cols,
  maxLength,
  className = '',
  onBlur,
  onFocus,
  ref,
  description,
  error,
  ...rest
}) => {
  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  // CSS 클래스 결정
  const wrapperClasses = useMemo(() => {
    return [styles.wrapper, className].filter(Boolean).join(' ');
  }, [className]);

  const textareaClasses = useMemo(() => {
    return [styles.textarea, disabled && styles.disabled, readOnly && styles.readOnly].filter(Boolean).join(' ');
  }, [disabled, readOnly]);

  // aria-describedby 생성
  const descriptionId = id ? `${id}-description` : undefined;
  const errorId = id ? `${id}-error` : undefined;
  const ariaDescribedBy = [error && errorId, description && descriptionId].filter(Boolean).join(' ') || undefined;
  console.log('textareaClasses =>', textareaClasses);

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <div className={wrapperClasses}>
      {/* 레이블 */}
      {label && (
        <div className={styles.label}>
          <span className={required ? styles.required : ''}>{label}</span>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        id={id}
        name={name || id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        className={textareaClasses}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-required={required}
        aria-label={label || placeholder}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />

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

export default Textarea;
