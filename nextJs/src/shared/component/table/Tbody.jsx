import styles from './table.module.scss';

/**
 * 테이블 바디 컴포넌트 (<tbody> 태그 래핑)
 *
 * 테이블의 본문 행 그룹입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 바디 행 내용 (Tr)
 * @param {Object} props...rest - HTML <tbody> 네이티브 속성
 *
 * @example
 * <Tbody>
 *   <Tr>
 *     <Td>홍길동</Td>
 *     <Td>hong@example.com</Td>
 *   </Tr>
 *   <Tr>
 *     <Td>김철수</Td>
 *     <Td>kim@example.com</Td>
 *   </Tr>
 * </Tbody>
 */
const Tbody = ({ className = '', ...rest }) => {
  return <tbody className={`${styles.tbody} ${className}`} {...rest} />;
};

export default Tbody;
