import styles from './buttonBasic.module.scss';

/**
 * 통합 버튼 컴포넌트
 * @param {Object} props
 * @param {'primary'|'basic'|'secondary'|'logout'} [props.variant='basic'] - 버튼 스타일
 * @param {string} [props.label] - 버튼 텍스트 (권장)
 * @param {React.ReactNode} [props.children] - 버튼 내용 (JSX 구조용)
 * @param {'button'|'submit'|'reset'} [props.type='button'] - 버튼 타입
 * @param {Function} [props.onClick] - 클릭 핸들러
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref} [props.ref] - ref (포커스, 스크롤 등)
 * @param {Object} [props...rest] - 기타 HTML button 속성 (aria-*, name, value 등)
 *
 * @example
 * // 기본 사용
 * <Button variant="primary" label="저장" onClick={handleSave} />
 *
 * // 폼 제출
 * <Button type="submit" variant="primary" label="저장" />
 *
 * // ref 사용
 * <Button ref={buttonRef} label="포커스" />
 *
 * // 로딩 상태
 * <Button variant="primary" label="저장" loading />
 *
 * // children 사용
 * <Button variant="primary">
 *   <Icon name="save" /> 저장
 * </Button>
 *
 * // 접근성
 * <Button label="닫기" aria-label="모달 닫기" />
 */
export const Button = ({
  variant = 'basic',
  label,
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  ref,
  ...rest
}) => {
  // variant별 CSS 클래스 매핑
  const getVariantClass = () => {
    const variantMap = {
      basic: '', // 기본 스타일은 btnBasic만 사용 (흰색 버튼)
      primary: styles.primeBtn, // 보라색 버튼
      secondary: styles.secondBtn, // 연보라색 버튼
      logout: styles.logout // 로그아웃 버튼
    };
    return variantMap[variant] || '';
  };

  // 최종 클래스명 조합
  const buttonClasses = [
    styles.btnBasic, // 모든 버튼의 기본 클래스
    getVariantClass(), // variant별 추가 클래스
    loading && 'loading', // 로딩 상태일 때 추가 클래스 (필요시 CSS에서 정의)
    className // 사용자 정의 클래스
  ]
    .filter(Boolean)
    .join(' ');

  // 로딩 또는 disabled 상태 처리
  const isDisabled = disabled || loading;

  // label 우선, 없으면 children 사용
  const buttonContent = label || children;

  return (
    <button ref={ref} type={type} className={buttonClasses} onClick={onClick} disabled={isDisabled} {...rest}>
      {loading ? (
        <>
          <span style={{ opacity: 0.7 }}>로딩 중...</span>
        </>
      ) : (
        buttonContent
      )}
    </button>
  );
};

export default Button;
