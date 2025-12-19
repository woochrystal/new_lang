import styles from './table.module.scss';

/**
 * 테이블 행 컴포넌트 (<tr> 태그 래핑)
 *
 * 테이블의 한 행을 나타냅니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 행 셀 내용 (Th, Td)
 * @param {Object} props...rest - HTML <tr> 네이티브 속성
 *
 * @example
 * <Tr>
 *   <Th>이름</Th>
 *   <Th>이메일</Th>
 * </Tr>
 */
const Tr = ({ className = '', ...rest }) => {
  return <tr className={`${styles.tr} ${className}`} {...rest} />;
};

export default Tr;
