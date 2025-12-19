import styles from './table.module.scss';

/**
 * 테이블 데이터 셀 컴포넌트 (<td> 태그 래핑)
 *
 * 테이블 본문 행의 셀입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 셀 내용
 * @param {Object} props...rest - HTML <td> 네이티브 속성
 *
 * @example
 * <Td>홍길동</Td>
 */
const Td = ({ className = '', ...rest }) => {
  return <td className={`${styles.td} ${className}`} {...rest} />;
};

export default Td;
