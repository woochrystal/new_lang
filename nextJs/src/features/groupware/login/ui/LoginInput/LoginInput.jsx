/**
 * @fileoverview 로그인 전용 입력 컴포넌트
 * @description 캡스락 감지 기능 추가
 */

'use client';

import InputTit from '@/shared/ui/Input/InputTit';
import styles from './LoginInput.module.scss';

/**
 * 로그인 전용 입력 컴포넌트
 * @param {Object} props
 * @param {string} props.label - 입력 필드 라벨
 * @param {string} props.id - input id 속성
 * @param {string} props.name - input name 속성
 * @param {string} props.type - input type ('text', 'password', 'email' 등)
 * @param {string} props.value - 입력 값
 * @param {function} props.onChange - 값 변경 핸들러
 * @param {string} props.placeholder - placeholder 텍스트
 * @param {boolean} props.required - 필수 입력 여부 (별표 표시)
 * @param {string} props.error - 에러 메시지
 * @param {boolean} props.disabled - 비활성화 상태
 * @param {string} props.className - 추가 CSS 클래스
 * @param {string} props.formGroupClass - 폼 그룹 CSS 클래스 (부모에서 제공)
 * @param {string} props.inputClass - 입력 CSS 클래스 (부모에서 제공)
 * @param {string} props.errorClass - 에러 CSS 클래스 (부모에서 제공)
 */
export const LoginInput = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  disabled = false,
  className = '',
  formGroupClass = '',
  inputClass = '',
  errorClass = '',
  ...props
}) => {
  const inputClasses = [inputClass, error ? 'error' : '', className].filter(Boolean).join(' ');

  return (
    <div className={formGroupClass}>
      <InputTit inputTit={label} essential={required} />

      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={name}
          type={type}
          className={inputClasses}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      </div>

      {/* 에러 메시지 */}
      <div className={errorClass}>{error || ''}</div>
    </div>
  );
};

export default LoginInput;
