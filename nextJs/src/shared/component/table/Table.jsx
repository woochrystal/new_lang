import styles from './table.module.scss';

/**
 * 테이블 컴포넌트 (<table> 태그 래핑)
 *
 * 데이터를 행과 열로 표현합니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 테이블 내용 (Thead, Tbody, Tfoot)
 * @param {Object} props...rest - HTML <table> 네이티브 속성
 *
 * @example
 * <Table>
 *   <Thead>
 *     <Tr>
 *       <Th>이름</Th>
 *       <Th>이메일</Th>
 *     </Tr>
 *   </Thead>
 *   <Tbody>
 *     <Tr>
 *       <Td>홍길동</Td>
 *       <Td>hong@example.com</Td>
 *     </Tr>
 *   </Tbody>
 * </Table>
 */
const Table = ({ className = '', ...rest }) => {
  return <table className={`${styles.table} ${className}`} {...rest} />;
};

export default Table;
