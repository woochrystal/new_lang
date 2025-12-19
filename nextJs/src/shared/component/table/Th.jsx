import styles from './table.module.scss';

/**
 * 테이블 헤더 셀 컴포넌트 (<th> 태그 래핑)
 *
 * 테이블 헤더 행의 셀입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 셀 내용
 * @param {Object} props...rest - HTML <th> 네이티브 속성
 *
 * @example
 * <Th>이름</Th>
 */
const Th = ({ className = '', ...rest }) => {
  return <th className={`${styles.th} ${className}`} {...rest} />;
};

export default Th;
