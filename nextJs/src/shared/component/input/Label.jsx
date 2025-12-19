import styles from './input.module.scss';

/**
 * 레이블 컴포넌트 (<label> 태그 래핑)
 *
 * 폼 입력 요소를 설명하는 레이블에 테마 스타일을 적용합니다.
 *
 * @param {Object} props
 * @param {boolean} [props.required=false] - 필수 입력 표시 (별표)
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {'sm'|'md'|'lg'} [props.size='md'] - 폰트 크기
 * @param {string} [props.htmlFor] - 연결할 input id
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 레이블 텍스트
 * @param {Object} props...rest - HTML <label> 네이티브 속성
 *
 * @example
 * // 기본 레이블
 * <Label htmlFor="username">사용자명</Label>
 *
 * @example
 * // 필수 입력 표시
 * <Label htmlFor="email" required>이메일</Label>
 *
 * @example
 * // 비활성화 레이블
 * <Label htmlFor="inactive" disabled>비활성화됨</Label>
 *
 * @example
 * // 폼 구성
 * <>
 *   <Label htmlFor="name" required>이름</Label>
 *   <input id="name" type="text" />
 * </>
 */
const Label = ({ required = false, disabled = false, size = 'md', className = '', children, ...rest }) => {
  const labelClasses = [styles.label, disabled && styles.disabled, styles[`size-${size}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={labelClasses} {...rest}>
      <span className={required ? styles.required : ''}>{children}</span>
    </label>
  );
};

export default Label;
