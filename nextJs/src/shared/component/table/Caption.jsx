import styles from './table.module.scss';

/**
 * 테이블 캡션 컴포넌트 (<caption> 태그 래핑)
 *
 * 테이블의 제목이나 설명입니다. (선택적)
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 캡션 내용
 * @param {Object} props...rest - HTML <caption> 네이티브 속성
 *
 * @example
 * <Caption>사용자 목록 (2024년 10월)</Caption>
 */
const Caption = ({ className = '', ...rest }) => {
  return <caption className={`${styles.caption} ${className}`} {...rest} />;
};

export default Caption;
