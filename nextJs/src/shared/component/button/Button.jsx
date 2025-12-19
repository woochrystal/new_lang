'use client';

import styles from './button.module.scss';

/**
 * 버튼 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {'primary'|'secondary'|'basic'|'logout'|'group'} [props.variant='basic'] - 버튼 스타일
 * @param {React.ReactNode} [props.children] - 버튼 내용
 * @param {'button'|'submit'|'reset'} [props.type='button'] - 버튼 타입
 * @param {Function} [props.onClick] - 클릭 핸들러
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {'full'|'titleOnly'} [props.groupSize] - group variant일 때 그룹 크기
 * @param {React.Ref<HTMLButtonElement|HTMLDivElement>} [props.ref] - ref (포커스, 스크롤 등)
 * @param {Object} [rest] - HTML 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * // 기본 사용
 * <Button variant="primary">저장</Button>
 *
 * // 보조 버튼
 * <Button variant="secondary">취소</Button>
 *
 * // 흰색 버튼
 * <Button variant="basic">버튼</Button>
 *
 * // 로그아웃 버튼
 * <Button variant="logout">로그아웃</Button>
 *
 * // 버튼 그룹 컨테이너
 * <Button variant="group">
 *   <Button variant="secondary">취소</Button>
 *   <Button variant="primary">확인</Button>
 * </Button>
 *
 * // 폼 제출
 * <Button type="submit" variant="primary">저장</Button>
 *
 * // 로딩 상태
 * <Button variant="primary" loading>저장</Button>
 *
 * // 접근성
 * <Button variant="basic" aria-label="모달 닫기">닫기</Button>
 *
 * // ref 사용
 * <Button ref={buttonRef} variant="primary">저장</Button>
 */
export const Button = ({
  variant = 'basic',
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  groupSize,
  ref,
  ...rest
}) => {
  // group variant는 div로 렌더링
  if (variant === 'group') {
    const groupClasses = [styles.buttonGroup, groupSize && styles[groupSize], className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={groupClasses}>
        {children}
      </div>
    );
  }

  // variant별 CSS 클래스 매핑
  const getVariantClass = () => {
    const variantMap = {
      basic: '', // 기본 스타일
      primary: styles.primary,
      secondary: styles.secondary,
      logout: styles.logout,
      danger: styles.danger
    };
    return variantMap[variant] || '';
  };

  // 최종 클래스명 조합
  const buttonClasses = [
    styles.button, // 모든 버튼의 기본 클래스
    getVariantClass(), // variant별 추가 클래스
    loading && styles.loading, // 로딩 상태
    className // 사용자 정의 클래스
  ]
    .filter(Boolean)
    .join(' ');

  // 로딩 또는 disabled 상태 처리
  const isDisabled = disabled || loading;

  return (
    <button ref={ref} type={type} className={buttonClasses} onClick={onClick} disabled={isDisabled} {...rest}>
      {loading ? <span>로딩 중...</span> : children}
    </button>
  );
};

export default Button;
